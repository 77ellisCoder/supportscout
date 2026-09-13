import {
    Router,
    Request,
    Response,
} from "express";
import crypto from "node:crypto";
import {
    Pool,
} from "pg";

import {
    createGoogleAuthorizationUrl,
    exchangeGoogleCode,
    getGoogleBusyPeriods,
} from "../services/calendar/GoogleCalendarService";

import {
    calculateAvailabilityFromWindows,
    intersectAvailability,
} from "../services/calendar/AvailabilityService";

import {
    testICloudConnection,
    getICloudBusyPeriods
} from "../services/calendar/ICloudCalendarService";

import {
    encryptToken,
} from "../services/calendar/crypto";

import type {
    BusyPeriod,
} from "../services/calendar/types";

const calendarRouter = Router();

let pool: Pool;

type CalendarRange = {
    start: Date;
    end: Date;
};

type CalendarProvider =
    | "google"
    | "icloud";

type UserCalendarConnection = {
    userId: number;
    provider: CalendarProvider;
    email: string;
    encryptedRefreshToken: string | null;
    encryptedPassword: string | null;
    timezone: string | null;
};

type BandMemberRow = {
    userId: number;
    displayName: string | null;
    email: string;
    relationship: string;
};

type UserAvailabilityPreferences = {
    minimumMinutes: number;
    bufferMinutes: number;
    timezone: string;

    windows: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
    }[];
};

export function initCalendarRouter(
    databasePool: Pool
) {
    pool = databasePool;

    return calendarRouter;
}

function parseId(
    value: unknown
): number | null {
    const id = Number(value);

    return Number.isInteger(id) &&
        id > 0
        ? id
        : null;
}

function parseDateRange(
    req: Request
): {
    from: Date;
    to: Date;
} | null {
    const from =
        new Date(
            String(req.query.from)
        );

    const to =
        new Date(
            String(req.query.to)
        );

    if (
        Number.isNaN(
            from.getTime()
        ) ||
        Number.isNaN(
            to.getTime()
        ) ||
        from >= to
    ) {
        return null;
    }

    return {
        from,
        to,
    };
}

function serializeRanges(
    ranges: CalendarRange[]
) {
    return ranges.map(
        (item) => ({
            start:
                item.start.toISOString(),

            end:
                item.end.toISOString(),
        })
    );
}

function mergeBusyPeriods(
    periods: BusyPeriod[]
): BusyPeriod[] {

    if (periods.length === 0) {
        return [];
    }

    const sorted = [...periods]
        .sort(
            (a, b) =>
                a.start.getTime() -
                b.start.getTime()
        );

    const merged: BusyPeriod[] = [
        {
            start: new Date(
                sorted[0].start
            ),
            end: new Date(
                sorted[0].end
            ),
        },
    ];

    for (
        let index = 1;
        index < sorted.length;
        index++
    ) {
        const current =
            sorted[index];

        const previous =
            merged[
            merged.length - 1
            ];

        if (
            current.start <=
            previous.end
        ) {
            if (
                current.end >
                previous.end
            ) {
                previous.end =
                    new Date(
                        current.end
                    );
            }

            continue;
        }

        merged.push({
            start: new Date(
                current.start
            ),
            end: new Date(
                current.end
            ),
        });
    }

    return merged;
}

async function getUserAvailabilityPreferences(
    userId: number
): Promise<UserAvailabilityPreferences> {
    const settingsResult =
        await pool.query(
            `
            SELECT
                minimum_minutes::int
                    AS "minimumMinutes",

                buffer_minutes::int
                    AS "bufferMinutes",

                timezone

            FROM user_availability_settings

            WHERE user_id = $1
            `,
            [userId]
        );

    const windowsResult =
        await pool.query(
            `
            SELECT
                day_of_week::int
                    AS "dayOfWeek",

                start_time::text
                    AS "startTime",

                end_time::text
                    AS "endTime"

            FROM user_availability_windows

            WHERE user_id = $1

            ORDER BY
                day_of_week,
                start_time
            `,
            [userId]
        );

    const settings =
        settingsResult.rows[0];

    return {
        minimumMinutes:
            settings?.minimumMinutes ??
            60,

        bufferMinutes:
            settings?.bufferMinutes ??
            30,

        timezone:
            settings?.timezone ??
            "Australia/Perth",

        windows:
            windowsResult.rows,
    };
}

async function getUserCalendarConnections(
    userId: number
): Promise<UserCalendarConnection[]> {

    const result =
        await pool.query(
            `
            SELECT
                user_id::int
                    AS "userId",

                provider,

                email,

                encrypted_refresh_token
                    AS "encryptedRefreshToken",

                encrypted_password
                    AS "encryptedPassword",

                timezone

            FROM user_calendar_connections

            WHERE user_id = $1

            ORDER BY provider
            `,
            [userId]
        );

    return result.rows;
}

async function getConnectionBusyPeriods(
    connection:
        UserCalendarConnection,
    from: Date,
    to: Date
): Promise<BusyPeriod[]> {

    switch (
    connection.provider
    ) {

        case "google": {

            const refreshToken =
                connection.encryptedRefreshToken;

            if (!refreshToken) {
                throw new Error(
                    `Google connection for user ${connection.userId} has no refresh token`
                );
            }

            return getGoogleBusyPeriods(
                refreshToken!,
                from,
                to
            );
        }

        case "icloud": {

            const encryptedPassword =
                connection.encryptedPassword;

            if (!encryptedPassword) {
                throw new Error(
                    `iCloud connection for user ${connection.userId} has no password`
                );
            }

            return getICloudBusyPeriods(
                {
                    username:
                        connection.email,

                    encryptedPassword:
                        encryptedPassword!,
                },
                from,
                to
            );
        }

        default:
            return [];
    }
}

async function getUserBusyPeriods(
    userId: number,
    from: Date,
    to: Date
): Promise<{
    busy: BusyPeriod[];
    connections:
    UserCalendarConnection[];
}> {

    const connections =
        await getUserCalendarConnections(
            userId
        );

    const results =
        await Promise.all(
            connections.map(
                (connection) =>
                    getConnectionBusyPeriods(
                        connection,
                        from,
                        to
                    )
            )
        );

    const busy =
        mergeBusyPeriods(
            results.flat()
        );

    return {
        busy,
        connections,
    };
}

function getSuccessUrl() {
    return (
        process.env
            .GOOGLE_CALENDAR_SUCCESS_URL ??
        "supportscout://calendar-connected"
    );
}

/*
|--------------------------------------------------------------------------
| CONNECT GOOGLE CALENDAR
|--------------------------------------------------------------------------
|
| Calendar connection now belongs to a USER,
| not directly to a band.
|
*/

calendarRouter.get(
    "/google/connect",
    (
        req: Request,
        res: Response
    ) => {
        const userId =
            parseId(
                req.query.userId
            );

        if (!userId) {
            return res.status(400).json({
                error:
                    "userId is required",
            });
        }

        const state =
            Buffer.from(
                JSON.stringify({
                    userId,

                    nonce:
                        crypto
                            .randomBytes(24)
                            .toString(
                                "hex"
                            ),
                })
            ).toString(
                "base64url"
            );

        res.json({
            url:
                createGoogleAuthorizationUrl(
                    state
                ),
        });
    }
);

/*
|--------------------------------------------------------------------------
| GOOGLE CALLBACK
|--------------------------------------------------------------------------
*/

calendarRouter.get(
    "/google/callback",
    async (
        req: Request,
        res: Response
    ) => {
        try {
            console.log(
                "Google callback query:",
                req.query
            );

            const oauthError =
                typeof req.query.error ===
                    "string"
                    ? req.query.error
                    : null;

            const oauthErrorDescription =
                typeof req.query
                    .error_description ===
                    "string"
                    ? req.query
                        .error_description
                    : null;

            if (oauthError) {
                console.error(
                    "Google OAuth returned error:",
                    oauthError,
                    oauthErrorDescription
                );

                return res
                    .status(400)
                    .send(
                        `Google OAuth failed: ${oauthError}` +
                        (
                            oauthErrorDescription
                                ? ` - ${oauthErrorDescription}`
                                : ""
                        )
                    );
            }

            const code =
                typeof req.query.code ===
                    "string"
                    ? req.query.code
                    : null;

            const rawState =
                typeof req.query.state ===
                    "string"
                    ? req.query.state
                    : null;

            if (!code || !rawState) {
                console.error(
                    "Google OAuth callback missing parameters:",
                    req.query
                );

                return res
                    .status(400)
                    .send(
                        "Missing Google OAuth parameters."
                    );
            }

            // rest of existing callback...

            const state =
                JSON.parse(
                    Buffer.from(
                        rawState,
                        "base64url"
                    ).toString(
                        "utf8"
                    )
                );

            const userId =
                parseId(
                    state.userId
                );

            if (!userId) {
                return res
                    .status(400)
                    .send(
                        "Invalid calendar connection state."
                    );
            }

            /*
             * Ensure the user actually exists.
             */
            const userResult =
                await pool.query(
                    `
                    SELECT user_id
                    FROM users
                    WHERE user_id = $1
                    `,
                    [userId]
                );

            if (
                userResult.rowCount ===
                0
            ) {
                return res
                    .status(404)
                    .send(
                        "User not found."
                    );
            }

            const connection =
                await exchangeGoogleCode(
                    code
                );

            await pool.query(
                `
                INSERT INTO user_calendar_connections (
                    user_id,
                    provider,
                    provider_account_id,
                    email,
                    encrypted_refresh_token,
                    timezone
                )
                VALUES (
                    $1,
                    'google',
                    $2,
                    $3,
                    $4,
                    'Australia/Perth'
                )

                ON CONFLICT (
                    user_id,
                    provider
                )

                DO UPDATE SET
                    provider_account_id =
                        EXCLUDED.provider_account_id,

                    email =
                        EXCLUDED.email,

                    encrypted_refresh_token =
                        EXCLUDED.encrypted_refresh_token,

                    updated_at =
                        NOW()
                `,
                [
                    userId,
                    connection
                        .providerAccountId,
                    connection.email,
                    connection
                        .encryptedRefreshToken,
                ]
            );

            const successUrl =
                getSuccessUrl();

            const separator =
                successUrl.includes("?")
                    ? "&"
                    : "?";

            res.redirect(
                `${successUrl}${separator}userId=${userId}`
            );
        } catch (error) {
            console.error(
                "Google calendar callback failed:",
                error
            );

            res
                .status(500)
                .send(
                    "Unable to connect Google Calendar."
                );
        }
    }
);

/*
|--------------------------------------------------------------------------
| USER CALENDAR STATUS
|--------------------------------------------------------------------------
*/

calendarRouter.get(
    "/users/:userId/status",
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            parseId(
                req.params.userId
            );

        if (!userId) {
            return res.status(400).json({
                error:
                    "Invalid userId",
            });
        }

        try {
            const result =
                await pool.query(
                    `
                    SELECT
                        provider,
                        email,
                        timezone

                    FROM user_calendar_connections

                    WHERE user_id = $1
                    `,
                    [userId]
                );

            const row =
                result.rows[0];

            res.json({
                userId,

                connected:
                    Boolean(row),

                provider:
                    row?.provider ??
                    null,

                email:
                    row?.email ??
                    null,

                timezone:
                    row?.timezone ??
                    "Australia/Perth",
            });
        } catch (error) {
            console.error(
                "Calendar status lookup failed:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to load calendar status",
            });
        }
    }
);

/*
|--------------------------------------------------------------------------
| USER AVAILABILITY
|--------------------------------------------------------------------------
*/

calendarRouter.get(
    "/users/:userId/availability",
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            parseId(
                req.params.userId
            );

        if (!userId) {
            return res.status(400).json({
                error:
                    "Invalid userId",
            });
        }

        const range =
            parseDateRange(req);

        if (!range) {
            return res.status(400).json({
                error:
                    "Valid from and to dates are required.",
            });
        }

        try {
            const result =
                await pool.query(
                    `
                    SELECT
                        user_id::int
                            AS "userId",

                        encrypted_refresh_token
                            AS "encryptedRefreshToken",

                        timezone

                    FROM user_calendar_connections

                    WHERE user_id = $1
                      AND provider = 'google'
                    `,
                    [userId]
                );

            const {
                busy,
                connections,
            } =
                await getUserBusyPeriods(
                    userId,
                    range.from,
                    range.to
                );

            if (connections.length === 0) {
                return res.status(404).json({
                    error:
                        "No calendars connected to this user.",
                });
            }

            const preferences =
                await getUserAvailabilityPreferences(
                    userId
                );

            const available =
                calculateAvailabilityFromWindows(
                    range.from,
                    range.to,
                    busy,
                    preferences.windows,
                    {
                        minimumMinutes:
                            preferences
                                .minimumMinutes,

                        bufferMinutes:
                            preferences
                                .bufferMinutes,

                        utcOffsetMinutes:
                            480,
                    }
                );

            res.json({
                userId,

                timezone:
                    connections[0]?.timezone ??
                    "Australia/Perth",

                providers:
                    connections.map(
                        (connection) => ({
                            provider:
                                connection.provider,

                            email:
                                connection.email,
                        })
                    ),

                busy:
                    serializeRanges(
                        busy
                    ),

                available:
                    serializeRanges(
                        available
                    ),
            });
        } catch (error) {
            console.error(
                "User availability lookup failed:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to determine user availability",
            });
        }
    }
);

calendarRouter.get(
    "/users/:userId/preferences",
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            parseId(
                req.params.userId
            );

        if (!userId) {
            return res
                .status(400)
                .json({
                    error:
                        "Invalid userId",
                });
        }

        try {
            const preferences =
                await getUserAvailabilityPreferences(
                    userId
                );

            res.json({
                userId,
                ...preferences,
            });
        } catch (error) {
            console.error(
                "Availability preferences lookup failed:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to load availability preferences",
            });
        }
    }
);

calendarRouter.put(
    "/users/:userId/preferences",
    async (
        req: Request,
        res: Response
    ) => {
        const userId =
            parseId(
                req.params.userId
            );

        if (!userId) {
            return res
                .status(400)
                .json({
                    error:
                        "Invalid userId",
                });
        }

        const {
            minimumMinutes,
            bufferMinutes,
            timezone,
            windows,
        } = req.body;

        if (
            !Number.isInteger(
                minimumMinutes
            ) ||
            minimumMinutes < 15
        ) {
            return res
                .status(400)
                .json({
                    error:
                        "minimumMinutes must be at least 15",
                });
        }

        if (
            !Number.isInteger(
                bufferMinutes
            ) ||
            bufferMinutes < 0
        ) {
            return res
                .status(400)
                .json({
                    error:
                        "bufferMinutes must be 0 or greater",
                });
        }

        if (
            typeof timezone !==
            "string"
        ) {
            return res
                .status(400)
                .json({
                    error:
                        "timezone is required",
                });
        }

        if (!Array.isArray(windows)) {
            return res
                .status(400)
                .json({
                    error:
                        "windows must be an array",
                });
        }

        const validTime =
            /^([01]\d|2[0-3]):[0-5]\d$/;

        for (const window of windows) {
            if (
                !Number.isInteger(
                    window.dayOfWeek
                ) ||
                window.dayOfWeek < 0 ||
                window.dayOfWeek > 6 ||
                typeof window.startTime !==
                "string" ||
                typeof window.endTime !==
                "string" ||
                !validTime.test(
                    window.startTime
                ) ||
                !validTime.test(
                    window.endTime
                ) ||
                window.startTime >=
                window.endTime
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid availability window",
                    });
            }
        }

        const client =
            await pool.connect();

        try {
            await client.query(
                "BEGIN"
            );

            await client.query(
                `
                INSERT INTO user_availability_settings (
                    user_id,
                    minimum_minutes,
                    buffer_minutes,
                    timezone,
                    updated_at
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    NOW()
                )
                ON CONFLICT (user_id)
                DO UPDATE SET
                    minimum_minutes =
                        EXCLUDED.minimum_minutes,

                    buffer_minutes =
                        EXCLUDED.buffer_minutes,

                    timezone =
                        EXCLUDED.timezone,

                    updated_at =
                        NOW()
                `,
                [
                    userId,
                    minimumMinutes,
                    bufferMinutes,
                    timezone,
                ]
            );

            await client.query(
                `
                DELETE FROM
                    user_availability_windows
                WHERE user_id = $1
                `,
                [userId]
            );

            for (const window of windows) {
                await client.query(
                    `
                    INSERT INTO
                        user_availability_windows (
                            user_id,
                            day_of_week,
                            start_time,
                            end_time
                        )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4
                    )
                    `,
                    [
                        userId,
                        window.dayOfWeek,
                        window.startTime,
                        window.endTime,
                    ]
                );
            }

            await client.query(
                "COMMIT"
            );

            const preferences =
                await getUserAvailabilityPreferences(
                    userId
                );

            res.json({
                userId,
                ...preferences,
            });
        } catch (error) {
            await client.query(
                "ROLLBACK"
            );

            console.error(
                "Availability preferences update failed:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to save availability preferences",
            });
        } finally {
            client.release();
        }
    }
);

/*
|--------------------------------------------------------------------------
| BAND MEMBER AVAILABILITY
|--------------------------------------------------------------------------
|
| This is where the user -> band relationship starts paying off.
|
| A band does NOT own the calendars.
|
| Instead:
|
| Band
|   -> user_bands
|       -> users
|           -> user_calendar_connections
|
*/

calendarRouter.get(
    "/bands/:bandId/availability",
    async (
        req: Request,
        res: Response
    ) => {
        const bandId =
            parseId(
                req.params.bandId
            );

        if (!bandId) {
            return res.status(400).json({
                error:
                    "Invalid bandId",
            });
        }

        const range =
            parseDateRange(req);

        if (!range) {
            return res.status(400).json({
                error:
                    "Valid from and to dates are required.",
            });
        }

        try {
            const result =
                await pool.query(
                    `
                    SELECT
                        u.user_id::int
                            AS "userId",

                        u.display_name
                            AS "displayName",

                        u.email,

                        ub.relationship

                    FROM user_bands ub

                    INNER JOIN users u
                        ON u.user_id =
                            ub.user_id

                    WHERE ub.band_id = $1

                    ORDER BY
                        u.display_name ASC,
                        u.email ASC
                    `,
                    [bandId]
                );

            const members =
                result.rows as BandMemberRow[];

            const membersByUser =
                new Map<
                    number,
                    BandMemberRow[]
                >();

            for (const member of members) {

                const existing =
                    membersByUser.get(
                        member.userId
                    ) ?? [];

                existing.push(member);

                membersByUser.set(
                    member.userId,
                    existing
                );
            }

            const memberAvailability =
                await Promise.all(
                    members.map(
                        async (member) => {

                            const {
                                busy,
                                connections,
                            } =
                                await getUserBusyPeriods(
                                    member.userId,
                                    range.from,
                                    range.to
                                );

                            if (
                                connections.length ===
                                0
                            ) {
                                return {
                                    userId:
                                        member.userId,

                                    displayName:
                                        member.displayName,

                                    email:
                                        member.email,

                                    relationship:
                                        member.relationship,

                                    connected:
                                        false,

                                    providers:
                                        [],

                                    timezone:
                                        "Australia/Perth",

                                    minimumMinutes: 0,

                                    busy:
                                        [],

                                    available:
                                        [],
                                };
                            }

                            const preferences =
                                await getUserAvailabilityPreferences(
                                    member.userId
                                );

                            const available =
                                calculateAvailabilityFromWindows(
                                    range.from,
                                    range.to,
                                    busy,
                                    preferences.windows,
                                    {
                                        minimumMinutes:
                                            preferences.minimumMinutes,

                                        bufferMinutes:
                                            preferences.bufferMinutes,

                                        utcOffsetMinutes:
                                            480,
                                    }
                                );

                            return {
                                userId:
                                    member.userId,

                                displayName:
                                    member.displayName,

                                email:
                                    member.email,

                                relationship:
                                    member.relationship,

                                connected:
                                    true,

                                providers:
                                    connections.map(
                                        (
                                            connection
                                        ) =>
                                            connection.provider
                                    ),

                                timezone:
                                    preferences.timezone,

                                minimumMinutes:
                                    preferences.minimumMinutes,

                                busy:
                                    serializeRanges(
                                        busy
                                    ),

                                available:
                                    serializeRanges(
                                        available
                                    ),
                            };
                        }
                    )
                );

            const connectedMembers =
                memberAvailability.filter(
                    (member) =>
                        member.connected
                );

            const minimumSharedMinutes =
                Math.max(
                    ...connectedMembers.map(
                        (member) =>
                            member.minimumMinutes
                    ),
                    0
                );

            const sharedAvailable =
                intersectAvailability(
                    connectedMembers.map(
                        (member) =>
                            member.available.map(
                                (period) => ({
                                    start: new Date(
                                        period.start
                                    ),
                                    end: new Date(
                                        period.end
                                    ),
                                })
                            )
                    )
                ).filter(
                    (interval) =>
                        interval.end.getTime() -
                        interval.start.getTime() >=
                        minimumSharedMinutes *
                        60_000
                );

            res.json({
                bandId,

                from:
                    range.from.toISOString(),

                to:
                    range.to.toISOString(),

                members:
                    memberAvailability,

                sharedAvailable:
                    serializeRanges(
                        sharedAvailable
                    ),
            });
        } catch (error) {
            console.error(
                "Band availability lookup failed:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to determine band availability",
            });
        }
    }
);

/* icloud */
calendarRouter.post(
    "/icloud/connect",
    async (
        req: Request,
        res: Response
    ) => {
        try {
            const {
                userId,
                email,
                appSpecificPassword,
            } = req.body;

            if (
                !userId ||
                !email ||
                !appSpecificPassword
            ) {
                return res.status(400).json({
                    error:
                        "userId, email and appSpecificPassword are required",
                });
            }

            await testICloudConnection(
                email,
                appSpecificPassword
            );

            const encryptedPassword =
                encryptToken(
                    appSpecificPassword
                );

            await pool.query(
                `
                INSERT INTO user_calendar_connections (
                    user_id,
                    provider,
                    provider_account_id,
                    email,
                    encrypted_password,
                    timezone
                )
                VALUES (
                    $1,
                    'icloud',
                    $2,
                    $3,
                    $4,
                    'Australia/Perth'
                )
                ON CONFLICT (
                    user_id,
                    provider
                )
                DO UPDATE SET
                    provider_account_id =
                        EXCLUDED.provider_account_id,
                    email =
                        EXCLUDED.email,
                    encrypted_password =
                        EXCLUDED.encrypted_password,
                    updated_at =
                        NOW()
                `,
                [
                    userId,
                    email,
                    email,
                    encryptedPassword,
                ]
            );

            return res.json({
                success: true,
                provider: "icloud",
                email,
            });

        } catch (error) {
            console.error(
                "iCloud connection failed:",
                error
            );

            return res.status(400).json({
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to connect iCloud Calendar",
            });
        }
    }
);

export default calendarRouter;