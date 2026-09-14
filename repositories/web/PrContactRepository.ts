import type { PrContact } from "../../models/PrContact";

import {
    API_URL,
} from "../../config/api";

export const PrContactRepository = {
    async getAll(): Promise<PrContact[]> {
        const response = await fetch(
            `${API_URL}/pr-contacts`
        );

        if (!response.ok) {
            throw new Error(
                `Unable to load PR contacts (${response.status})`
            );
        }

        return response.json();
    },
};