import { useQuery } from "@tanstack/react-query";

import { BandRepository } from "../repositories/Repository";

export function useBand(id: number) {
    return useQuery({
        queryKey: ["band", id],

        queryFn: () => {
            return BandRepository.getById(id);
        },

        enabled: Number.isFinite(id),
    });
}