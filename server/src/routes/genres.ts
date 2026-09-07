import { Router } from "express";

import { pool } from "../database/postgres";

export const genresRouter = Router();

genresRouter.get("/", async (_req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                genre_id AS "genreId",
                genre_name AS "genreName",
            FROM genres
            ORDER BY genre_name;
        `);

        res.json(
            result.rows.map((row) => ({
                id: Number(row.genreId),
                name: row.genreName,
            }))
        );
    } catch (error) {
        console.error("GET /genres failed:", error);

        res.status(500).json({
            error: "Unable to load genres",
        });
    }
});

genresRouter.get("/:id", async (req, res) => {
    try {
        const genreId = Number(req.params.id);

        if (!Number.isInteger(genreId)) {
            return res.status(400).json({
                error: "Invalid genre ID",
            });
        }

        const result = await pool.query(
            `
            SELECT
                genre_id AS "genreId",
                genre_name AS "genreName",
            FROM genres

            WHERE genre_id = $1
            `,
            [genreId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Genre not found",
            });
        }

        res.json(result.rows[0] ? {
            id: Number(result.rows[0].genreId),
            name: result.rows[0].genreName,
        } : null);
    } catch (error) {
        console.error(
            "GET /genres/:id failed:",
            error
        );

        res.status(500).json({
            error: "Unable to load genre",
        });
    }
});