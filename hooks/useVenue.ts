import { useQuery } from "@tanstack/react-query";

import { VenueRepository } from "../repositories/VenueRepository";

export function useVenue(id: number) {
    return useQuery({
        queryKey: ["venues", id],

        queryFn: () =>
            VenueRepository.getById(id),

        enabled: Number.isFinite(id),
    });
}