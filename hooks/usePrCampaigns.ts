import { useQuery } from "@tanstack/react-query";

import {
    PrCampaignRepository,
} from "../repositories/Repository";

export function usePrCampaigns() {
    return useQuery({
        queryKey: ["pr-campaigns"],

        queryFn: () =>
            PrCampaignRepository.getAll(),

        staleTime: 60 * 1000,
    });
}