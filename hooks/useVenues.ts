import { useQuery } from "@tanstack/react-query";
import { VenueRepository } from "../repositories/device/VenueRepository";

export function useVenues() {
  return useQuery({
    queryKey: ["venues"],
    queryFn: () => VenueRepository.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}