import { Response, Router } from "express";

import { pool } from "../database/postgres";
import {
    AuthenticatedRequest,
    requireAuth,
} from "../middleware/requireAuth";
import {
    canManageBand,
    isSystemAdmin,
} from "../services/auth/AuthorizationService";

export const adminRouter = Router();

adminRouter.use(requireAuth);

function parseId(value: unknown): number | null {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function getUserId(req: AuthenticatedRequest): number | null {
    return req.auth?.userId ?? null;
}

async function requireSystemAdmin(
    req: AuthenticatedRequest,
    res: Response
): Promise<number | null> {
    const userId = getUserId(req);

    if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return null;
    }

    if (!await isSystemAdmin(userId)) {
        res.status(403).json({ error: "System administrator access required" });
        return null;
    }

    return userId;
}

async function requireBandAdmin(
    req: AuthenticatedRequest,
    res: Response,
    bandId: number
): Promise<number | null> {
    const userId = getUserId(req);

    if (!userId) {
        res.status(401).json({ error: "Authentication required" });
        return null;
    }

    if (!await canManageBand(userId, bandId)) {
        res.status(403).json({ error: "Band administrator access required" });
        return null;
    }

    return userId;
}

adminRouter.get(
    "/me",
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                error: "Authentication required",
            });
        }

        try {
            const [systemAdmin, bandResult] = await Promise.all([
                isSystemAdmin(userId),
                pool.query(
                    `
                    SELECT band_id::int AS "bandId"
                    FROM user_bands
                    WHERE user_id = $1
                      AND band_role = 'band_admin'
                    ORDER BY band_id
                    `,
                    [userId]
                ),
            ]);

            return res.json({
                systemAdmin,
                bandAdminIds: bandResult.rows.map(
                    (row) => row.bandId
                ),
            });
        } catch (error) {
            console.error("Unable to load admin access:", error);
            return res.status(500).json({
                error: "Unable to load admin access",
            });
        }
    }
);

adminRouter.get(
    "/users",
    async (req: AuthenticatedRequest, res: Response) => {
        if (!await requireSystemAdmin(req, res)) return;

        try {
            const result = await pool.query(
                `
                SELECT
                    u.user_id::int AS "userId",
                    u.display_name AS "displayName",
                    u.email,
                    EXISTS (
                        SELECT 1
                        FROM user_roles ur
                        WHERE ur.user_id = u.user_id
                          AND ur.role = 'system_admin'
                    ) AS "systemAdmin"
                FROM users u
                ORDER BY LOWER(COALESCE(u.display_name, u.email)), u.user_id
                `
            );

            return res.json(result.rows);
        } catch (error) {
            console.error("Unable to load admin users:", error);
            return res.status(500).json({
                error: "Unable to load users",
            });
        }
    }
);

adminRouter.put(
    "/users/:userId/system-admin",
    async (req: AuthenticatedRequest, res: Response) => {
        const actorId = await requireSystemAdmin(req, res);
        if (!actorId) return;

        const targetId = parseId(req.params.userId);
        const enabled = req.body?.enabled;

        if (!targetId || typeof enabled !== "boolean") {
            return res.status(400).json({
                error: "A valid userId and boolean enabled value are required",
            });
        }

        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            await client.query("LOCK TABLE user_roles IN EXCLUSIVE MODE");

            const target = await client.query(
                "SELECT user_id FROM users WHERE user_id = $1",
                [targetId]
            );

            if (target.rowCount === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ error: "User not found" });
            }

            if (enabled) {
                await client.query(
                    `
                    INSERT INTO user_roles (user_id, role)
                    VALUES ($1, 'system_admin')
                    ON CONFLICT (user_id, role) DO NOTHING
                    `,
                    [targetId]
                );
            } else {
                const currentRole = await client.query(
                    `
                    SELECT 1
                    FROM user_roles
                    WHERE user_id = $1
                      AND role = 'system_admin'
                    `,
                    [targetId]
                );

                if (currentRole.rowCount) {
                    const countResult = await client.query(
                        `
                        SELECT COUNT(*)::int AS count
                        FROM user_roles
                        WHERE role = 'system_admin'
                        `
                    );

                    if (countResult.rows[0].count <= 1) {
                        await client.query("ROLLBACK");
                        return res.status(409).json({
                            error: "Cannot remove the last system administrator",
                        });
                    }
                }

                await client.query(
                    `
                    DELETE FROM user_roles
                    WHERE user_id = $1
                      AND role = 'system_admin'
                    `,
                    [targetId]
                );
            }

            await client.query("COMMIT");
            return res.json({
                userId: targetId,
                systemAdmin: enabled,
            });
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Unable to update system-admin role:", error);
            return res.status(500).json({
                error: "Unable to update system-admin role",
            });
        } finally {
            client.release();
        }
    }
);

adminRouter.get(
    "/bands",
    async (req: AuthenticatedRequest, res: Response) => {
        const userId = getUserId(req);

        if (!userId) {
            return res.status(401).json({
                error: "Authentication required",
            });
        }

        try {
            const systemAdmin = await isSystemAdmin(userId);
            const result = await pool.query(
                `
                SELECT band_id::int AS "bandId", band_name AS "bandName"
                FROM bands b
                WHERE $1::boolean OR EXISTS (
                    SELECT 1
                    FROM user_bands ub
                    WHERE ub.user_id = $2
                      AND ub.band_id = b.band_id
                      AND ub.band_role = 'band_admin'
                )
                ORDER BY band_name
                `,
                [systemAdmin, userId]
            );

            return res.json(result.rows);
        } catch (error) {
            console.error("Unable to load admin bands:", error);
            return res.status(500).json({ error: "Unable to load bands" });
        }
    }
);

adminRouter.get(
    "/bands/:bandId/members",
    async (req: AuthenticatedRequest, res: Response) => {
        const bandId = parseId(req.params.bandId);

        if (!bandId) {
            return res.status(400).json({ error: "Invalid bandId" });
        }

        if (!await requireBandAdmin(req, res, bandId)) return;

        try {
            const result = await pool.query(
                `
                SELECT
                    u.user_id::int AS "userId",
                    u.display_name AS "displayName",
                    u.email,
                    ub.relationship,
                    ub.band_role AS "bandRole"
                FROM user_bands ub
                INNER JOIN users u ON u.user_id = ub.user_id
                WHERE ub.band_id = $1
                ORDER BY LOWER(COALESCE(u.display_name, u.email)), u.user_id
                `,
                [bandId]
            );

            return res.json(result.rows);
        } catch (error) {
            console.error("Unable to load band members:", error);
            return res.status(500).json({
                error: "Unable to load band members",
            });
        }
    }
);

adminRouter.get(
    "/bands/:bandId/available-users",
    async (req: AuthenticatedRequest, res: Response) => {
        const bandId = parseId(req.params.bandId);

        if (!bandId) {
            return res.status(400).json({ error: "Invalid bandId" });
        }

        if (!await requireBandAdmin(req, res, bandId)) return;

        const search = String(req.query.search ?? "").trim();

        try {
            const result = await pool.query(
                `
                SELECT
                    u.user_id::int AS "userId",
                    u.display_name AS "displayName",
                    u.email
                FROM users u
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM user_bands ub
                    WHERE ub.user_id = u.user_id
                      AND ub.band_id = $1
                )
                  AND (
                    $2 = ''
                    OR u.email ILIKE '%' || $2 || '%'
                    OR COALESCE(u.display_name, '') ILIKE '%' || $2 || '%'
                  )
                ORDER BY LOWER(COALESCE(u.display_name, u.email)), u.user_id
                LIMIT 50
                `,
                [bandId, search]
            );

            return res.json(result.rows);
        } catch (error) {
            console.error("Unable to search band members:", error);
            return res.status(500).json({
                error: "Unable to search users",
            });
        }
    }
);

adminRouter.post(
    "/bands/:bandId/members",
    async (req: AuthenticatedRequest, res: Response) => {
        const bandId = parseId(req.params.bandId);
        const userId = parseId(req.body?.userId);
        const bandRole = req.body?.bandRole ?? "member";

        if (!bandId || !userId) {
            return res.status(400).json({
                error: "Valid bandId and userId are required",
            });
        }

        const actorId = await requireBandAdmin(req, res, bandId);
        if (!actorId) return;

        if (bandRole !== "member" && bandRole !== "band_admin") {
            return res.status(400).json({ error: "Invalid band role" });
        }

        if (bandRole === "band_admin" && !await isSystemAdmin(actorId)) {
            return res.status(403).json({
                error: "Only a system administrator can grant band-admin access",
            });
        }

        try {
            const result = await pool.query(
                `
                INSERT INTO user_bands (user_id, band_id, band_role)
                SELECT user_id, $2, $3
                FROM users
                WHERE user_id = $1
                ON CONFLICT (user_id, band_id)
                DO UPDATE SET band_role = EXCLUDED.band_role
                RETURNING user_id
                `,
                [userId, bandId, bandRole]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "User not found" });
            }

            return res.status(204).send();
        } catch (error) {
            console.error("Unable to add band member:", error);
            return res.status(500).json({ error: "Unable to add band member" });
        }
    }
);

adminRouter.patch(
    "/bands/:bandId/members/:userId/role",
    async (req: AuthenticatedRequest, res: Response) => {
        if (!await requireSystemAdmin(req, res)) return;

        const bandId = parseId(req.params.bandId);
        const userId = parseId(req.params.userId);
        const bandRole = req.body?.bandRole;

        if (!bandId || !userId || !["member", "band_admin"].includes(bandRole)) {
            return res.status(400).json({ error: "Invalid band role request" });
        }

        try {
            const result = await pool.query(
                `
                UPDATE user_bands
                SET band_role = $3
                WHERE band_id = $1
                  AND user_id = $2
                RETURNING band_role AS "bandRole"
                `,
                [bandId, userId, bandRole]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    error: "User is not a member of this band",
                });
            }

            return res.json({ userId, bandId, ...result.rows[0] });
        } catch (error) {
            console.error("Unable to update band role:", error);
            return res.status(500).json({ error: "Unable to update band role" });
        }
    }
);

adminRouter.delete(
    "/bands/:bandId/members/:userId",
    async (req: AuthenticatedRequest, res: Response) => {
        const bandId = parseId(req.params.bandId);
        const targetId = parseId(req.params.userId);

        if (!bandId || !targetId) {
            return res.status(400).json({ error: "Invalid band or user ID" });
        }

        const actorId = await requireBandAdmin(req, res, bandId);
        if (!actorId) return;

        try {
            if (!await isSystemAdmin(actorId)) {
                const result = await pool.query(
                    `
                    SELECT band_role AS "bandRole"
                    FROM user_bands
                    WHERE user_id = $1
                      AND band_id = $2
                    `,
                    [targetId, bandId]
                );

                if (result.rows[0]?.bandRole === "band_admin") {
                    const count = await pool.query(
                        `
                        SELECT COUNT(*)::int AS count
                        FROM user_bands
                        WHERE band_id = $1
                          AND band_role = 'band_admin'
                        `,
                        [bandId]
                    );

                    if (count.rows[0].count <= 1) {
                        return res.status(409).json({
                            error: "Cannot remove the last band administrator",
                        });
                    }
                }
            }

            const result = await pool.query(
                `
                DELETE FROM user_bands
                WHERE band_id = $1
                  AND user_id = $2
                RETURNING user_id
                `,
                [bandId, targetId]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({
                    error: "User is not a member of this band",
                });
            }

            return res.status(204).send();
        } catch (error) {
            console.error("Unable to remove band member:", error);
            return res.status(500).json({ error: "Unable to remove band member" });
        }
    }
);