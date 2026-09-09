import { useQuery } from "@tanstack/react-query";

import {
    WebPrCampaignRepository,
} from "../repositories/WebPrCampaignRepository";

export function usePrCampaign(
    campaignId: number
) {
    return useQuery({
        queryKey: [
            "pr-campaign",
            campaignId,
        ],

        queryFn: () =>
            WebPrCampaignRepository.getById(
                campaignId
            ),

        enabled:
            Number.isInteger(campaignId) &&
            campaignId > 0,
    });
}