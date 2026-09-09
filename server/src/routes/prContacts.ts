import { Router } from "express";

import { pool } from "../database/postgres";

export const prContactsRouter = Router();

prContactsRouter.get("/", async (_req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                pr_contact_id AS "id",
                outlet,
                language,
                contact_name AS "contactName",
                email,
                contact_type AS "contactType",
                location,
                best_pitch AS "bestPitch",
                summary,
                source_url AS "sourceUrl",
                is_active AS "isActive",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM pr_contacts
            WHERE is_active = TRUE
            ORDER BY outlet;
        `);

        res.json(
            result.rows.map((row) => ({
                ...row,
                id: Number(row.id),
            }))
        );
    } catch (error) {
        console.error(
            "GET /pr-contacts failed:",
            error
        );

        res.status(500).json({
            error: "Unable to load PR contacts",
        });
    }
});