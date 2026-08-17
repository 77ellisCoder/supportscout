import { useQuery } from "@tanstack/react-query";

import { BandRepository } from "../repositories/BandRepository";

export function useBand(id: number) {
    return useQuery({
        queryKey: ["venues", id],

        queryFn: () =>
            BandRepository.getById(id),

        enabled: Number.isFinite(id),
    });
}