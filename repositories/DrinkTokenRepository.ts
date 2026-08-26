import { getDatabase } from "../database/sqlite/Database";
import type { DrinkToken } from "../models/DrinkToken";

type DrinkTokenRow = {
    token_id: number;
    gig_id: number;
    band_id: number;
    used: number;
    used_at: string | null;
};

function mapRow(
    row: DrinkTokenRow
): DrinkToken {
    return {
        tokenId: row.token_id,
        gigId: row.gig_id,
        bandId: row.band_id,
        used: row.used === 1,
        usedAt: row.used_at,
    };
}

export const DrinkTokenRepository = {
    async getForGigBand(
        gigId: number,
        bandId: number
    ): Promise<DrinkToken[]> {
        const db = await getDatabase();

        const rows =
            await db.getAllAsync<DrinkTokenRow>(
                `
          SELECT
            token_id,
            gig_id,
            band_id,
            used,
            used_at
          FROM gig_band_drink_tokens
          WHERE
            gig_id = ?
            AND band_id = ?
          ORDER BY token_id
        `,
                gigId,
                bandId
            );

        return rows.map(mapRow);
    },

    async addTokens(
        gigId: number,
        bandId: number,
        count: number
    ): Promise<void> {
        const db = await getDatabase();

        for (let i = 0; i < count; i++) {
            await db.runAsync(
                `
          INSERT INTO gig_band_drink_tokens (
            gig_id,
            band_id
          )
          VALUES (?, ?)
        `,
                gigId,
                bandId
            );
        }
    },

    async useToken(
        tokenId: number
    ): Promise<void> {
        const db = await getDatabase();

        await db.runAsync(
            `
        UPDATE gig_band_drink_tokens
        SET
          used = 1,
          used_at = datetime('now')
        WHERE
          token_id = ?
          AND used = 0
      `,
            tokenId
        );
    },

    async removeUnusedToken(
        gigId: number,
        bandId: number
    ): Promise<void> {
        const db = await getDatabase();

        await db.runAsync(
            `
      DELETE FROM gig_band_drink_tokens
      WHERE token_id = (
        SELECT token_id
        FROM gig_band_drink_tokens
        WHERE
          gig_id = ?
          AND band_id = ?
          AND used = 0
        ORDER BY token_id DESC
        LIMIT 1
      )
    `,
            gigId,
            bandId
        );
    },
};