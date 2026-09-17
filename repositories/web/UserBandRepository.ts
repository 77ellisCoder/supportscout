import type {
    UserBand,
} from "../../models/UserBand";

import {
    API_URL,
} from "../../config/environment";

import {
    AuthStorage,
} from "../../services/storage/AuthStorage";

type ApiUserBand = {
    bandId: number | string;
    bandName: string;
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

function mapUserBand(
    row: ApiUserBand
): UserBand {
    return {
        bandId:
            Number(row.bandId),

        bandName:
            row.bandName,

        relationship:
            row.relationship,
    };
}

export const UserBandRepository = {
    async getMine(): Promise<UserBand[]> {
        const token =
            await getToken();

        const response =
            await fetch(
                `${API_URL}/users/me/bands`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        if (!response.ok) {
            throw new Error(
                `Unable to load your bands (${response.status})`
            );
        }

        const rows: ApiUserBand[] =
            await response.json();

        return rows.map(
            mapUserBand
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