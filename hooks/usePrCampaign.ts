import { useQuery } from "@tanstack/react-query";

import {
    PrCampaignRepository,
} from "../repositories";

export function usePrCampaign(
    campaignId: number
) {
    return useQuery({
        queryKey: [
            "pr-campaign",
            campaignId,
        ],

        queryFn: () =>
            PrCampaignRepository.getById(
                campaignId
            ),

        enabled:
            Number.isInteger(campaignId) &&
            campaignId > 0,
    });
}