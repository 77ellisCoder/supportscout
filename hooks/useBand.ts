import { useQuery } from "@tanstack/react-query";

import { BandRepository } from "../repositories/BandRepository";
import { WebBandRepository } from "../repositories/WebBandRepository";
import { Platform } from "react-native";

export function useBand(id: number) {
    return useQuery({
        queryKey: ["band", id],

        queryFn: () => {
            if (Platform.OS === "web") {
                return WebBandRepository.getById(id);
            }

            return BandRepository.getById(id);
        },

        enabled: Number.isFinite(id),
    });
}