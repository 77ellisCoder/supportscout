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
    calculateAvailability,
    intersectAvailability,
} from "../services/calendar/AvailabilityService";

const calendarRouter = Router();

let pool: Pool;

type CalendarRange = {
    start: Date;
    end: Date;
};

type UserCalendarConnection = {
    userId: number;
    encryptedRefreshToken: string;
    timezone: string;
};

type BandMemberRow = {
    userId: number;
    displayName: string | null;
    email: string;
    relationship: string;
    encryptedRefreshToken: string | null;
    timezone: string | null;
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

            const connection:
                UserCalendarConnection |
                undefined =
                result.rows[0];

            if (!connection) {
                return res.status(404).json({
                    error:
                        "No Google Calendar connected to this user.",
                });
            }

            const busy =
                await getGoogleBusyPeriods(
                    connection
                        .encryptedRefreshToken,
                    range.from,
                    range.to
                );

            const available =
                calculateAvailability(
                    range.from,
                    range.to,
                    busy,
                    {
                        startHour: 8,
                        endHour: 18,
                        minimumMinutes: 30,
                        bufferMinutes: 30,
                        includeWeekends:
                            false,
                        utcOffsetMinutes:
                            480,
                    }
                );

            res.json({
                userId,

                timezone:
                    connection.timezone,

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

                        ub.relationship,

                        ucc.encrypted_refresh_token
                            AS "encryptedRefreshToken",

                        ucc.timezone

                    FROM user_bands ub

                    INNER JOIN users u
                        ON u.user_id =
                            ub.user_id

                    LEFT JOIN user_calendar_connections ucc
                        ON ucc.user_id =
                            u.user_id
                        AND ucc.provider =
                            'google'

                    WHERE ub.band_id = $1

                    ORDER BY
                        u.display_name ASC,
                        u.email ASC
                    `,
                    [bandId]
                );

            const members =
                result.rows as BandMemberRow[];

            const memberAvailability =
                await Promise.all(
                    members.map(
                        async (
                            member
                        ) => {
                            /*
                             * User belongs to the band,
                             * but has not connected
                             * their calendar yet.
                             */
                            if (
                                !member
                                    .encryptedRefreshToken
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

                                    timezone:
                                        null,

                                    busy: [],

                                    available:
                                        [],
                                };
                            }

                            const busy =
                                await getGoogleBusyPeriods(
                                    member
                                        .encryptedRefreshToken,
                                    range.from,
                                    range.to
                                );

                            const available =
                                calculateAvailability(
                                    range.from,
                                    range.to,
                                    busy,
                                    {
                                        startHour:
                                            8,

                                        endHour:
                                            18,

                                        minimumMinutes:
                                            30,

                                        bufferMinutes:
                                            30,

                                        includeWeekends:
                                            false,

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

                                timezone:
                                    member.timezone,

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

export default calendarRouter;