import type {
    CreatePrCampaignInput,
    PrCampaign,
} from "../models/PrCampaign";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:3001";

export const WebPrCampaignRepository = {
    async create(
        input: CreatePrCampaignInput
    ): Promise<PrCampaign> {
        console.log(
            "WebPrCampaignRepository.create:",
            input
        );

        const response = await fetch(
            `${API_URL}/pr-campaigns`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(input),
            }
        );

        const result = await response.json();

        console.log(
            "Create campaign response:",
            response.status,
            result
        );

        if (!response.ok) {
            throw new Error(
                result.error ??
                "Unable to create campaign"
            );
        }

        return result;
    },
};