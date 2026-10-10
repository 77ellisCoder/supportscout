import type { DrinkToken } from "../../models/DrinkToken";

import {
    API_URL,
} from "../../config/environment";

import {
    expectOk,
} from "../../utils/api";

export const DrinkTokenRepository = {
    async getForGigBand(
        gigId: number,
        bandId: number
    ): Promise<DrinkToken[]> {
        const response = await fetch(
            `${API_URL}/gigs/${gigId}/bands/${bandId}/drink-tokens`
        );

        await expectOk(
            response,
            `Request failed: ${response.status}`
        );

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

        await expectOk(
            response,
            `Request failed: ${response.status}`
        );
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

        await expectOk(
            response,
            `Request failed: ${response.status}`
        );
    },
};