import type { PrContact } from "../../models/PrContact";

import {
    API_URL,
} from "../../config/environment";

import {
    expectOk,
} from "../../utils/api";

export const PrContactRepository = {
    async getAll(): Promise<PrContact[]> {
        const response = await fetch(
            `${API_URL}/pr-contacts`
        );

        await expectOk(
            response,
            `Unable to load PR contacts (${response.status})`
        );

        return response.json();
    },
};