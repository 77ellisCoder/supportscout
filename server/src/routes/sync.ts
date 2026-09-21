import {
    Router,
} from "express";

import type {
    Pool,
} from "pg";

import {
    AuthenticatedRequest,
    requireAuth,
} from "../middleware/requireAuth";

export function initSyncRouter(
    pool: Pool
) {
    const router =
        Router();

    router.get(
        "/bootstrap",
        requireAuth,
        async (
            req: AuthenticatedRequest,
            res
        ) => {
            try {
                const userId =
                    req.auth?.userId;

                if (!userId) {
                    return res.status(
                        401
                    ).json({
                        error:
                            "Authentication required",
                    });
                }

                /*
                 * Determine which bands the
                 * authenticated user belongs to.
                 */
                const userBandsResult =
                    await pool.query(
                        `
                        SELECT
                            user_id::int
                                AS "userId",

                            band_id::int
                                AS "bandId",

                            relationship

                        FROM user_bands

                        WHERE user_id = $1
                        `,
                        [userId]
                    );

                const bandIds =
                    userBandsResult.rows.map(
                        (row) =>
                            row.bandId
                    );

                /*
                 * Bands and general research data
                 * are currently shared SupportScout
                 * data, so send the full catalogue.
                 */

                const bands =
                    (
                        await pool.query(`
                            SELECT
                                band_id::int
                                    AS "bandId",

                                band_name
                                    AS "bandName",

                                slug,
                                hometown,

                                state_region
                                    AS "stateRegion",

                                country_code
                                    AS "countryCode",

                                member_count
                                    AS "memberCount",

                                formation_year
                                    AS "formationYear",

                                status,

                                short_description
                                    AS "shortDescription",

                                internal_notes
                                    AS "internalNotes",

                                is_our_band
                                    AS "isOurBand",

                                is_verified
                                    AS "isVerified",

                                booking_contact_name
                                    AS "bookingContactName",

                                contact_email
                                    AS "contactEmail",

                                facebook_url
                                    AS "facebookUrl",

                                instagram_url
                                    AS "instagramUrl",

                                website_url
                                    AS "websiteUrl",

                                created_at
                                    AS "createdAt",

                                updated_at
                                    AS "updatedAt",

                                archived_at
                                    AS "archivedAt"

                            FROM bands

                            ORDER BY band_id
                        `)
                    ).rows;

                const genres =
                    (
                        await pool.query(`
                            SELECT
                                genre_id::int
                                    AS "genreId",

                                genre_name
                                    AS "genreName",

                                created_at
                                    AS "createdAt"

                            FROM genres

                            ORDER BY genre_id
                        `)
                    ).rows;

                const bandGenres =
                    (
                        await pool.query(`
                            SELECT
                                band_id::int
                                    AS "bandId",

                                genre_id::int
                                    AS "genreId"

                            FROM band_genres
                        `)
                    ).rows;

                const venues =
                    (
                        await pool.query(`
                            SELECT
                                venue_id::int
                                    AS "venueId",

                                venue_name
                                    AS "venueName",

                                slug,
                                suburb,

                                state_region
                                    AS "stateRegion",

                                country_code
                                    AS "countryCode",

                                address,
                                capacity,

                                venue_type
                                    AS "venueType",

                                website_url
                                    AS "websiteUrl",

                                booking_url
                                    AS "bookingUrl",

                                booking_email
                                    AS "bookingEmail",

                                short_description
                                    AS "shortDescription",

                                internal_notes
                                    AS "internalNotes",

                                status,

                                is_verified
                                    AS "isVerified",

                                created_at
                                    AS "createdAt",

                                updated_at
                                    AS "updatedAt",

                                archived_at
                                    AS "archivedAt"

                            FROM venues

                            ORDER BY venue_id
                        `)
                    ).rows;

                const gigs =
                    (
                        await pool.query(`
                            SELECT
                                gig_id::int
                                    AS "gigId",

                                venue_id::int
                                    AS "venueId",

                                gig_date
                                    AS "gigDate",

                                event_name
                                    AS "eventName",

                                notes,
                                status,

                                created_at
                                    AS "createdAt",

                                updated_at
                                    AS "updatedAt",

                                start_time::text
                                    AS "startTime",

                                end_time::text
                                    AS "endTime"

                            FROM gigs

                            ORDER BY gig_date
                        `)
                    ).rows;

                const gigBands =
                    (
                        await pool.query(`
                            SELECT
                                gig_id::int
                                    AS "gigId",

                                band_id::int
                                    AS "bandId",

                                billing_order
                                    AS "billingOrder",

                                role

                            FROM gig_bands
                        `)
                    ).rows;

                const drinkTokens =
                    (
                        await pool.query(`
                            SELECT
                                token_id::int
                                    AS "tokenId",

                                gig_id::int
                                    AS "gigId",

                                band_id::int
                                    AS "bandId",

                                used,

                                used_at
                                    AS "usedAt"

                            FROM gig_band_drink_tokens
                        `)
                    ).rows;

                /*
                 * User/rehearsal information is
                 * restricted to bands belonging
                 * to the authenticated user.
                 */

                let users: unknown[] = [];
                let userBands: unknown[] = [];
                let rehearsalLocations:
                    unknown[] = [];
                let bandRehearsalLocations:
                    unknown[] = [];
                let rehearsalProposals:
                    unknown[] = [];

                if (
                    bandIds.length > 0
                ) {
                    users =
                        (
                            await pool.query(
                                `
                                SELECT DISTINCT
                                    u.user_id::int
                                        AS "userId",

                                    u.email,

                                    u.display_name
                                        AS "displayName",

                                    u.created_at
                                        AS "createdAt",

                                    u.updated_at
                                        AS "updatedAt"

                                FROM users u

                                INNER JOIN
                                    user_bands ub
                                    ON ub.user_id =
                                        u.user_id

                                WHERE
                                    ub.band_id =
                                    ANY($1::bigint[])

                                ORDER BY
                                    "userId"
                                `,
                                [bandIds]
                            )
                        ).rows;

                    userBands =
                        userBandsResult.rows;

                    rehearsalLocations =
                        (
                            await pool.query(
                                `
                                SELECT DISTINCT
                                    rl.rehearsal_location_id::int
                                        AS "rehearsalLocationId",

                                    rl.name,
                                    rl.address,
                                    rl.suburb,
                                    rl.state,
                                    rl.postcode,
                                    rl.phone,
                                    rl.email,
                                    rl.website,

                                    rl.booking_url
                                        AS "bookingUrl",

                                    rl.default_session_minutes
                                        AS "defaultSessionMinutes",

                                    rl.indicative_rate::float8
                                        AS "indicativeRate",

                                    rl.notes,
                                    rl.active,

                                    rl.created_at
                                        AS "createdAt",

                                    rl.updated_at
                                        AS "updatedAt"

                                FROM
                                    rehearsal_locations rl

                                INNER JOIN
                                    band_rehearsal_locations brl
                                    ON
                                        brl.rehearsal_location_id =
                                        rl.rehearsal_location_id

                                WHERE
                                    brl.band_id =
                                    ANY($1::bigint[])

                                ORDER BY "rehearsalLocationId"
                                `,
                                [bandIds]
                            )
                        ).rows;

                    bandRehearsalLocations =
                        (
                            await pool.query(
                                `
                                SELECT
                                    band_id::int
                                        AS "bandId",

                                    rehearsal_location_id::int
                                        AS "rehearsalLocationId",

                                    is_favourite
                                        AS "isFavourite",

                                    notes,

                                    created_at
                                        AS "createdAt"

                                FROM
                                    band_rehearsal_locations

                                WHERE
                                    band_id =
                                    ANY($1::bigint[])
                                `,
                                [bandIds]
                            )
                        ).rows;

                    rehearsalProposals =
                        (
                            await pool.query(
                                `
                                SELECT
                                    proposal_id::int
                                        AS "proposalId",

                                    band_id::int
                                        AS "bandId",

                                    proposed_by_user_id::int
                                        AS "proposedByUserId",

                                    start_at
                                        AS "startAt",

                                    end_at
                                        AS "endAt",

                                    location,
                                    notes,
                                    status,

                                    created_at
                                        AS "createdAt",

                                    updated_at
                                        AS "updatedAt",

                                    rehearsal_location_id::int
                                        AS "rehearsalLocationId"

                                FROM
                                    rehearsal_proposals

                                WHERE
                                    band_id =
                                    ANY($1::bigint[])

                                ORDER BY
                                    start_at
                                `,
                                [bandIds]
                            )
                        ).rows;
                }

                return res.json({
                    syncVersion: 1,

                    syncedAt:
                        new Date()
                            .toISOString(),

                    bands,
                    genres,
                    bandGenres,
                    venues,
                    gigs,
                    gigBands,
                    gigBandDrinkTokens:
                        drinkTokens,

                    users,
                    userBands,

                    rehearsalLocations,
                    bandRehearsalLocations,
                    rehearsalProposals,
                });
            } catch (error) {
                console.error(
                    "Bootstrap sync failed:",
                    error
                );

                return res.status(
                    500
                ).json({
                    error:
                        "Unable to create sync snapshot",
                });
            }
        }
    );

    return router;
}