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
} from "../services/calendar/AvailabilityService";

const calendarRouter = Router();

let pool: Pool;

export function initCalendarRouter(
    databasePool: Pool
) {
    pool = databasePool;
    return calendarRouter;
}

function parseBandId(
    value: unknown
): number | null {
    const id = Number(value);

    return Number.isInteger(id) &&
        id > 0
        ? id
        : null;
}

function getSuccessUrl() {
    return (
        process.env.GOOGLE_CALENDAR_SUCCESS_URL ??
        "supportscout://calendar-connected"
    );
}

calendarRouter.get(
    "/google/connect",
    (req: Request, res: Response) => {
        const bandId =
            parseBandId(
                req.query.bandId
            );

        if (!bandId) {
            return res.status(400).json({
                error:
                    "bandId is required",
            });
        }

        const state = Buffer.from(
            JSON.stringify({
                bandId,
                nonce:
                    crypto
                        .randomBytes(24)
                        .toString("hex"),
            })
        ).toString("base64url");

        res.json({
            url:
                createGoogleAuthorizationUrl(
                    state
                ),
        });
    }
);

calendarRouter.get(
    "/google/callback",
    async (
        req: Request,
        res: Response
    ) => {
        try {
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
                return res
                    .status(400)
                    .send(
                        "Missing Google OAuth parameters."
                    );
            }

            const state = JSON.parse(
                Buffer.from(
                    rawState,
                    "base64url"
                ).toString("utf8")
            );

            const bandId =
                parseBandId(
                    state.bandId
                );

            if (!bandId) {
                return res
                    .status(400)
                    .send(
                        "Invalid calendar connection state."
                    );
            }

            const connection =
                await exchangeGoogleCode(
                    code
                );

            await pool.query(
                `
                INSERT INTO band_calendar_connections (
                    band_id,
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
                    band_id,
                    provider
                )
                DO UPDATE SET
                    provider_account_id =
                        EXCLUDED.provider_account_id,
                    email =
                        EXCLUDED.email,
                    encrypted_refresh_token =
                        EXCLUDED.encrypted_refresh_token,
                    updated_at = NOW()
                `,
                [
                    bandId,
                    connection.providerAccountId,
                    connection.email,
                    connection.encryptedRefreshToken,
                ]
            );

            const separator =
                getSuccessUrl().includes("?")
                    ? "&"
                    : "?";

            res.redirect(
                `${getSuccessUrl()}${separator}bandId=${bandId}`
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

calendarRouter.get(
    "/bands/:bandId/status",
    async (
        req: Request,
        res: Response
    ) => {
        const bandId =
            parseBandId(
                req.params.bandId
            );

        if (!bandId) {
            return res.status(400).json({
                error:
                    "Invalid bandId",
            });
        }

        const result =
            await pool.query(
                `
                SELECT
                    provider,
                    email,
                    timezone
                FROM band_calendar_connections
                WHERE band_id = $1
                `,
                [bandId]
            );

        const row =
            result.rows[0];

        res.json({
            connected: Boolean(row),
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
    }
);

calendarRouter.get(
    "/bands/:bandId/availability",
    async (
        req: Request,
        res: Response
    ) => {
        const bandId =
            parseBandId(
                req.params.bandId
            );

        if (!bandId) {
            return res.status(400).json({
                error:
                    "Invalid bandId",
            });
        }

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
            return res.status(400).json({
                error:
                    "Valid from and to dates are required.",
            });
        }

        const result =
            await pool.query(
                `
                SELECT
                    encrypted_refresh_token,
                    timezone
                FROM band_calendar_connections
                WHERE band_id = $1
                  AND provider = 'google'
                `,
                [bandId]
            );

        const connection =
            result.rows[0];

        if (!connection) {
            return res.status(404).json({
                error:
                    "No Google Calendar connected to this band.",
            });
        }

        const busy =
            await getGoogleBusyPeriods(
                connection.encrypted_refresh_token,
                from,
                to
            );

        const available =
            calculateAvailability(
                from,
                to,
                busy,
                {
                    startHour: 8,
                    endHour: 18,
                    minimumMinutes: 30,
                    bufferMinutes: 30,
                    includeWeekends: false,
                    utcOffsetMinutes: 480,
                }
            );

        res.json({
            bandId,
            timezone:
                connection.timezone,
            busy: busy.map(
                (item) => ({
                    start:
                        item.start.toISOString(),
                    end:
                        item.end.toISOString(),
                })
            ),
            available:
                available.map(
                    (item) => ({
                        start:
                            item.start.toISOString(),
                        end:
                            item.end.toISOString(),
                    })
                ),
        });
    }
);

export default calendarRouter;
