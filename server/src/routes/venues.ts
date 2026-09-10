import { Router } from "express";
import { pool } from "../database/postgres";

export const venuesRouter =
    Router();

venuesRouter.get(
    "/",
    async (_req, res) => {
        try {
            const result =
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
                        NULL
                            AS "hometown"
                    FROM venues
                    WHERE archived_at IS NULL
                    ORDER BY venue_name
                `);

            res.json(result.rows);
        } catch (error) {
            console.error(
                "Failed to fetch venues:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch venues",
            });
        }
    }
);

venuesRouter.get(
    "/:id",
    async (req, res) => {
        try {
            const venueId =
                Number(req.params.id);

            if (
                !Number.isInteger(venueId)
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid venue ID",
                    });
            }

            const result =
                await pool.query(
                    `
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
                        NULL
                            AS "hometown"
                    FROM venues
                    WHERE venue_id = $1
                      AND archived_at IS NULL
                    `,
                    [venueId]
                );

            if (
                result.rowCount === 0
            ) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Venue not found",
                    });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error(
                "Failed to fetch venue:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to fetch venue",
            });
        }
    }
);

venuesRouter.post(
    "/",
    async (req, res) => {
        try {
            const {
                venueName,
                suburb,
                stateRegion = "WA",
                countryCode = "AU",
                address,
                capacity,
                venueType,
                websiteUrl,
                bookingUrl,
                bookingEmail,
                shortDescription,
                internalNotes,
                status,
                isVerified,
            } = req.body;

            if (
                !venueName ||
                !venueName.trim()
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Venue name is required",
                    });
            }

            const result =
                await pool.query(
                    `
                    INSERT INTO venues (
                        venue_name,
                        suburb,
                        state_region,
                        country_code,
                        address,
                        capacity,
                        venue_type,
                        website_url,
                        booking_url,
                        booking_email,
                        short_description,
                        internal_notes,
                        status,
                        is_verified
                    )
                    VALUES (
                        $1, $2, $3, $4, $5, $6, $7,
                        $8, $9, $10, $11, $12, $13, $14
                    )
                    RETURNING
                        venue_id::int AS "venueId"`,
                    [
                        venueName.trim(),
                        suburb ?? null,
                        stateRegion,
                        countryCode,
                        address ?? null,
                        capacity ?? null,
                        venueType ?? null,
                        websiteUrl ?? null,
                        bookingUrl ?? null,
                        bookingEmail ?? null,
                        shortDescription ?? null,
                        internalNotes ?? null,
                        status ?? "active",
                        isVerified ?? false,
                    ]
                );

            res.status(201).json(
                result.rows[0]
            );
        } catch (error) {
            console.error(
                "Failed to create venue:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to create venue",
            });
        }
    }
);

venuesRouter.patch(
    "/:id",
    async (req, res) => {
        try {
            const venueId =
                Number(req.params.id);

            if (
                !Number.isInteger(venueId)
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid venue ID",
                    });
            }

            const existing =
                await pool.query(
                    `
                    SELECT *
                    FROM venues
                    WHERE venue_id = $1
                      AND archived_at IS NULL
                    `,
                    [venueId]
                );

            if (
                existing.rowCount === 0
            ) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Venue not found",
                    });
            }

            const current =
                existing.rows[0];

            const {
                venueName,
                suburb,
                stateRegion,
                countryCode,
                address,
                capacity,
                venueType,
                websiteUrl,
                bookingUrl,
                bookingEmail,
                shortDescription,
                internalNotes,
                status,
                isVerified,
            } = req.body;

            await pool.query(
                `
                UPDATE venues
                SET
                    venue_name = $1,
                    suburb = $2,
                    state_region = $3,
                    country_code = $4,
                    address = $5,
                    capacity = $6,
                    venue_type = $7,
                    website_url = $8,
                    booking_url = $9,
                    booking_email = $10,
                    short_description = $11,
                    internal_notes = $12,
                    status = $13,
                    is_verified = $14,
                    updated_at = CURRENT_TIMESTAMP
                WHERE venue_id = $15
                `,
                [
                    venueName ??
                    current.venue_name,
                    suburb !== undefined
                        ? suburb
                        : current.suburb,
                    stateRegion !== undefined
                        ? stateRegion
                        : current.state_region,
                    countryCode !== undefined
                        ? countryCode
                        : current.country_code,
                    address !== undefined
                        ? address
                        : current.address,
                    capacity !== undefined
                        ? capacity
                        : current.capacity,
                    venueType !== undefined
                        ? venueType
                        : current.venue_type,
                    websiteUrl !== undefined
                        ? websiteUrl
                        : current.website_url,
                    bookingUrl !== undefined
                        ? bookingUrl
                        : current.booking_url,
                    bookingEmail !== undefined
                        ? bookingEmail
                        : current.booking_email,
                    shortDescription !== undefined
                        ? shortDescription
                        : current.short_description,
                    internalNotes !== undefined
                        ? internalNotes
                        : current.internal_notes,
                    status ??
                    current.status,
                    isVerified !== undefined
                        ? isVerified
                        : current.is_verified,
                    venueId,
                ]
            );

            res.json({
                success: true,
            });
        } catch (error) {
            console.error(
                "Failed to update venue:",
                error
            );

            res.status(500).json({
                error:
                    "Failed to update venue",
            });
        }
    }
);