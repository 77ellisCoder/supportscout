import type { DrinkToken } from "../../models/DrinkToken";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:3001";

async function ensureOk(
    response: Response
): Promise<void> {
    if (!response.ok) {
        const message =
            await response.text();

        throw new Error(
            message ||
            `Request failed: ${response.status}`
        );
    }
}

export const DrinkTokenRepository = {
    async getForGigBand(
        gigId: number,
        bandId: number
    ): Promise<DrinkToken[]> {
        const response = await fetch(
            `${API_URL}/gigs/${gigId}/bands/${bandId}/drink-tokens`
        );

        await ensureOk(response);

        return response.json();
    },

    async addTokens(
        gigId: number,
        bandId: number,
        count: number
    ): Promise<void> {
        const response = await fetch(
            `${API_URL}/gigs/${gigId}/bands/${bandId}/drink-tokens`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    count,
                }),
            }
        );

        await ensureOk(response);
    },

    async removeUnusedToken(
        gigId: number,
        bandId: number
    ): Promise<void> {
        const response = await fetch(
            `${API_URL}/gigs/${gigId}/bands/${bandId}/drink-tokens/unused`,
            {
                method: "DELETE",
            }
        );

        await ensureOk(response);
    },

    async useToken(
        tokenId: number
    ): Promise<void> {
        const response = await fetch(
            `${API_URL}/drink-tokens/${tokenId}/use`,
            {
                method: "PATCH",
            }
        );

        await ensureOk(response);
    },
};