import {
    Response,
    Router,
} from "express";

import {
    pool,
} from "../database/postgres";

import {
    AuthenticatedRequest,
    requireAuth,
} from "../middleware/requireAuth";

export const userBandsRouter =
    Router();

/**
 * All routes in this router require
 * an authenticated SupportScout user.
 */
userBandsRouter.use(
    requireAuth
);

/**
 * GET /users/me/bands
 *
 * Return all bands assigned to the
 * currently authenticated user.
 */
userBandsRouter.get(
    "/me/bands",
    async (
        req: AuthenticatedRequest,
        res: Response
    ) => {
        try {
            const userId =
                req.auth?.userId;

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Authentication required",
                    });
            }

            const result =
                await pool.query(
                    `
                    SELECT
                        b.band_id::int
                            AS "bandId",

                        b.band_name
                            AS "bandName",

                        ub.relationship

                    FROM
                        user_bands ub

                    INNER JOIN
                        bands b
                        ON
                            b.band_id =
                            ub.band_id

                    WHERE
                        ub.user_id = $1

                    ORDER BY
                        b.band_name ASC
                    `,
                    [
                        userId,
                    ]
                );

            return res.json(
                result.rows
            );
        } catch (
        error
        ) {
            console.error(
                "Unable to fetch user bands:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to fetch user bands",
                });
        }
    }
);

/**
 * POST /users/me/bands/:bandId
 *
 * Assign a band to the currently
 * authenticated user.
 */
userBandsRouter.post(
    "/me/bands/:bandId",
    async (
        req: AuthenticatedRequest,
        res: Response
    ) => {
        try {
            const userId =
                req.auth?.userId;

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Authentication required",
                    });
            }

            const bandId =
                Number(
                    req.params.bandId
                );

            if (
                !Number.isInteger(
                    bandId
                ) ||
                bandId <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid band ID",
                    });
            }

            /**
             * Make sure the requested band
             * actually exists.
             */
            const bandResult =
                await pool.query(
                    `
                    SELECT
                        band_id

                    FROM
                        bands

                    WHERE
                        band_id = $1
                    `,
                    [
                        bandId,
                    ]
                );

            if (
                bandResult.rowCount ===
                0
            ) {
                return res
                    .status(404)
                    .json({
                        error:
                            "Band not found",
                    });
            }

            /**
             * Assign the band.
             *
             * ON CONFLICT means this operation
             * is safe if the user already has
             * the band assigned.
             */
            await pool.query(
                `
                INSERT INTO
                    user_bands (
                        user_id,
                        band_id
                    )

                VALUES (
                    $1,
                    $2
                )

                ON CONFLICT
                    DO NOTHING
                `,
                [
                    userId,
                    bandId,
                ]
            );

            return res
                .status(204)
                .send();
        } catch (
        error
        ) {
            console.error(
                "Unable to add user band:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to add user band",
                });
        }
    }
);

/**
 * DELETE /users/me/bands/:bandId
 *
 * Remove a band assignment from the
 * currently authenticated user.
 */
userBandsRouter.delete(
    "/me/bands/:bandId",
    async (
        req: AuthenticatedRequest,
        res: Response
    ) => {
        try {
            const userId =
                req.auth?.userId;

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Authentication required",
                    });
            }

            const bandId =
                Number(
                    req.params.bandId
                );

            if (
                !Number.isInteger(
                    bandId
                ) ||
                bandId <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid band ID",
                    });
            }

            await pool.query(
                `
                DELETE FROM
                    user_bands

                WHERE
                    user_id = $1
                    AND
                    band_id = $2
                `,
                [
                    userId,
                    bandId,
                ]
            );

            return res
                .status(204)
                .send();
        } catch (
        error
        ) {
            console.error(
                "Unable to remove user band:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to remove user band",
                });
        }
    }
);