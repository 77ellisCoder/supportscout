import type {
    CampaignAttachment,
    CreatePrCampaignInput,
    PrCampaign,
    PrCampaignListItem,
} from "../../models/PrCampaign";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:3001";

export const PrCampaignRepository = {
    /**
     * Creates a new PR campaign with the provided input data.
     * @param input Input data for creating a new PR campaign, including name, subject, email body, and contact IDs.
     * @returns 
     */
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

    /**
     * Gets all PR campaigns from the server.
     * @returns A promise that resolves to an array of PR campaign list items.
     */
    async getAll(): Promise<
        PrCampaignListItem[]
    > {
        const response = await fetch(
            `${API_URL}/pr-campaigns`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ??
                "Unable to load PR campaigns"
            );
        }

        return result;
    },

    /**
     * Gets a PR campaign by its ID.
     * @param campaignId Campaign ID of the PR campaign to retrieve.
     * @returns A promise that resolves to the PR campaign object.
     */
    async getById(
        campaignId: number
    ): Promise<PrCampaign> {
        const response = await fetch(
            `${API_URL}/pr-campaigns/${campaignId}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ??
                "Unable to load campaign"
            );
        }

        return result;
    },

    /**
     * Uploads an attachment for a specific PR campaign.
     * @param campaignId Campaign ID for which the attachment is being uploaded.
     * @param file The file object containing the URI, name, and optional MIME type of the attachment.
     * @returns 
     */
    async uploadAttachment(
        campaignId: number,
        file: {
            uri: string;
            name: string;
            mimeType?: string | null;
        }
    ): Promise<CampaignAttachment> {
        const formData = new FormData();

        /*
         * Expo Web's document picker gives us a blob URL,
         * so turn it back into a Blob before adding it
         * to FormData.
         */
        const fileResponse = await fetch(file.uri);

        const blob = await fileResponse.blob();

        formData.append(
            "attachment",
            blob,
            file.name
        );

        const response = await fetch(
            `${API_URL}/pr-campaigns/${campaignId}/attachment`,
            {
                method: "POST",
                body: formData,
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ??
                "Unable to upload MP3"
            );
        }

        return result;
    },

    /**
     * Sends a test email for a specific PR campaign.
     * @param campaignId Campaign ID for which to send a test email.
     * @returns A promise that resolves to an object containing the success status, campaign ID, and the email address to which the test email was sent.
     */
    async sendTest(
        campaignId: number
    ): Promise<{
        success: boolean;
        campaignId: number;
        sentTo: string;
    }> {
        const response = await fetch(
            `${API_URL}/pr-campaigns/${campaignId}/send-test`,
            {
                method: "POST",
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error ??
                "Unable to send test email"
            );
        }

        return result;
    },
};