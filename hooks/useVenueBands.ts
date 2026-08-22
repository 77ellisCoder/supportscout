import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/GigRepository";

export function useVenueBands(
    venueId: number
) {
    return useQuery({
        queryKey: [
            "venues",
            venueId,
            "bands",
        ],

        queryFn: () =>
            GigRepository.getBandsByVenueId(
                venueId
            ),

        enabled:
            Number.isFinite(venueId) &&
            venueId > 0,
    });
}