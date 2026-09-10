import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/Repository";

export function useGigDetail(
    gigId: number
) {
    return useQuery({
        queryKey: [
            "gigs",
            gigId,
            "detail",
        ],

        queryFn: () =>
            GigRepository.getDetailById(
                gigId
            ),

        enabled:
            Number.isFinite(gigId) &&
            gigId > 0,
    });
}