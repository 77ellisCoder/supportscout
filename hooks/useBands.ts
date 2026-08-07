import { useQuery } from "@tanstack/react-query";
import { BandRepository } from "../repositories/BandRepository";

export function useBands() {
  const query = useQuery({
    queryKey: ["bands"],
    queryFn: async () => {
      const bands = await BandRepository.getAll();
      return bands;
    },
    enabled: true,
    retry: false,
  });

  return query;
}