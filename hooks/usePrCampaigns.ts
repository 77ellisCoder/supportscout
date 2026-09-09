import { useQuery } from "@tanstack/react-query";

import {
    WebPrCampaignRepository,
} from "../repositories/WebPrCampaignRepository";

export function usePrCampaigns() {
    return useQuery({
        queryKey: ["pr-campaigns"],

        queryFn: () =>
            WebPrCampaignRepository.getAll(),

        staleTime: 60 * 1000,
    });
}