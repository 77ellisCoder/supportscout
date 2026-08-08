import { useQuery } from "@tanstack/react-query";
import { BandRepository } from "../repositories/BandRepository";

export function useBands() {
  const query = useQuery({
    queryKey: ["bands"],
    queryFn: async () => {
      console.log("Fetching bands");

      const bands = await BandRepository.getAll();

      console.log("Fetched bands:", bands.length);

      return bands;
    },
    enabled: true,
    retry: false,
  });

  return query;
}