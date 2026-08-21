import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/GigRepository";

export function useGig(id: number) {
    return useQuery({
        queryKey: ["gigs", id],

        queryFn: () =>
            GigRepository.getById(id),

        enabled: Number.isFinite(id),
    });
}