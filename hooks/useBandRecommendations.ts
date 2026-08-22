import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/GigRepository";

export function useBandRecommendations(
    bandId: number
) {
    return useQuery({
        queryKey: [
            "bands",
            bandId,
            "recommendations",
        ],

        queryFn: () =>
            GigRepository.getBandRecommendations(
                bandId
            ),

        enabled:
            Number.isFinite(bandId) &&
            bandId > 0,
    });
}