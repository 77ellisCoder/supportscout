import type {
    UserBand,
} from "../../models/UserBand";

import {
    getDatabase,
} from "../../database/sqlite/Database";

import {
    API_URL,
} from "../../config/environment";

import {
    AuthStorage,
} from "../../services/storage/AuthStorage";

type UserBandRow = {
    band_id: number;
    band_name: string;
    relationship: string;
};

async function getToken(): Promise<string> {
    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "Authentication required"
        );
    }

    return token;
}

export const UserBandRepository = {
    async getMine(): Promise<UserBand[]> {
        const db =
            await getDatabase();

        const rows =
            await db.getAllAsync<UserBandRow>(
                `
                SELECT
                    ub.band_id,
                    b.band_name,
                    ub.relationship

                FROM
                    user_bands ub

                INNER JOIN
                    bands b
                    ON
                        b.band_id =
                        ub.band_id

                ORDER BY
                    b.band_name COLLATE NOCASE
                `
            );

        return rows.map(
            (row) => ({
                bandId:
                    row.band_id,

                bandName:
                    row.band_name,

                relationship:
                    row.relationship,
            })
        );
    },

    async add(
        bandId: number
    ): Promise<void> {
        const token =
            await getToken();

        const response =
            await fetch(
                `${API_URL}/users/me/bands/${bandId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        if (!response.ok) {
            throw new Error(
                `Unable to add band (${response.status})`
            );
        }
    },

    async remove(
        bandId: number
    ): Promise<void> {
        const token =
            await getToken();

        const response =
            await fetch(
                `${API_URL}/users/me/bands/${bandId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        if (!response.ok) {
            throw new Error(
                `Unable to remove band (${response.status})`
            );
        }
    },
};