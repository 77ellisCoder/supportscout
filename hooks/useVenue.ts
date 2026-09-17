import { useQuery } from "@tanstack/react-query";

import { VenueRepository } from "../repositories";

export function useVenue(
    venueId: number
) {
    return useQuery({
        queryKey: ["venues", venueId],

        queryFn: () =>
            VenueRepository.getById(
                venueId
            ),

        enabled:
            Number.isFinite(venueId) &&
            venueId > 0,
    });
}