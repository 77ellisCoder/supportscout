import { useQuery } from "@tanstack/react-query";

import { BandRepository } from "../repositories/Repository";

export function useBands(search = "") {
  return useQuery({
    queryKey: ["bands", search],

    queryFn: () => {
      return BandRepository.getAll(search);
    },

    staleTime: 5 * 60 * 1000,
  });
}