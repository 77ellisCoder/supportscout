import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/Repository";

export function useBandGigs(
    bandId: number,
    period: "upcoming" | "past"
) {
    return useQuery({
        queryKey: [
            "bands",
            bandId,
            "gigs",
            period,
        ],

        queryFn: () =>
            GigRepository.getByBandId(
                bandId,
                period
            ),

        enabled:
            Number.isFinite(bandId) &&
            bandId > 0,
    });
}