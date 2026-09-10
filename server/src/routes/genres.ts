import { Router } from "express";

import { pool } from "../database/postgres";

export const genresRouter = Router();

genresRouter.get("/", async (_req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                genre_id::int AS "id",
                genre_name AS "name"
            FROM genres
            ORDER BY genre_name;
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(
            "GET /genres failed:",
            error
        );

        res.status(500).json({
            error: "Unable to load genres",
        });
    }
});

genresRouter.get("/:id", async (req, res) => {
    try {
        const genreId = Number(req.params.id);

        if (
            !Number.isInteger(genreId) ||
            genreId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid genre ID",
            });
        }

        const result = await pool.query(
            `
            SELECT
                genre_id::int AS "id",
                genre_name AS "name"
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

        res.json(result.rows[0]);
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