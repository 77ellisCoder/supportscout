import { Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/GigRepository";
import { WebGigRepository } from "../repositories/WebGigRepository";

export function useGigs() {
    return useQuery({
        queryKey: ["gigs"],

        queryFn: () =>
            Platform.OS === "web"
                ? WebGigRepository.getAll()
                : GigRepository.getAll(),
    });
}