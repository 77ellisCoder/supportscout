import { useQuery } from "@tanstack/react-query";
import { BandRepository } from "../repositories/BandRepository";

export function useBands(search = "") {
  return useQuery({
    queryKey: ["bands", search],
    queryFn: () => BandRepository.getAll(search),
    staleTime: 5 * 60 * 1000,
  });
}