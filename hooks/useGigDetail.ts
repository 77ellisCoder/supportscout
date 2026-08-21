import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/GigRepository";

export function useGigDetail(
    gigId: number
) {
    return useQuery({
        queryKey: ["gigs", gigId, "detail"],

        queryFn: () =>
            GigRepository.getDetailById(gigId),

        enabled: Number.isFinite(gigId),
    });
}