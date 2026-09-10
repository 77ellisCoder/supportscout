import { Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/GigRepository";
import { WebGigRepository } from "../repositories/WebGigRepository";

export function useGigDetail(
    gigId: number
) {
    return useQuery({
        queryKey: ["gigs", gigId, "detail"],

        queryFn: () =>
            Platform.OS === "web"
                ? WebGigRepository.getDetailById(gigId)
                : GigRepository.getDetailById(gigId),

        enabled: Number.isFinite(gigId),
    });
}