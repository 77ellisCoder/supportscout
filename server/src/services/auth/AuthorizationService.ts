import { pool } from "../../database/postgres";

export async function isSystemAdmin(
    userId: number
): Promise<boolean> {
    const result = await pool.query(
        `
        SELECT EXISTS (
            SELECT 1
            FROM user_roles
            WHERE user_id = $1
              AND role = 'system_admin'
        ) AS "isSystemAdmin"
        `,
        [userId]
    );

    return result.rows[0]?.isSystemAdmin === true;
}

export async function canManageBand(
    userId: number,
    bandId: number
): Promise<boolean> {
    const result = await pool.query(
        `
        SELECT EXISTS (
            SELECT 1
            FROM user_roles
            WHERE user_id = $1
              AND role = 'system_admin'
        ) OR EXISTS (
            SELECT 1
            FROM user_bands
            WHERE user_id = $1
              AND band_id = $2
              AND band_role = 'band_admin'
        ) AS "canManageBand"
        `,
        [userId, bandId]
    );

    return result.rows[0]?.canManageBand === true;
}