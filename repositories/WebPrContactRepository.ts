import type { PrContact } from "../models/PrContact";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export const WebPrContactRepository = {
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