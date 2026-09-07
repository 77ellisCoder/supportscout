import { Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { BandRepository } from "../repositories/BandRepository";
import { WebBandRepository } from "../repositories/WebBandRepository";

export function useBands(search = "") {
  return useQuery({
    queryKey: ["bands", search],

    queryFn: () => {
      if (Platform.OS === "web") {
        return WebBandRepository.getAll(search);
      }

      return BandRepository.getAll(search);
    },

    staleTime: 5 * 60 * 1000,
  });
}