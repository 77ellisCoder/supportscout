import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories";

export function useVenueGigs(
    venueId: number,
    period: "upcoming" | "past"
) {
    return useQuery({
        queryKey: [
            "venues",
            venueId,
            "gigs",
            period,
        ],

        queryFn: () =>
            GigRepository.getByVenueId(
                venueId,
                period
            ),

        enabled:
            Number.isFinite(venueId) &&
            venueId > 0,
    });
}