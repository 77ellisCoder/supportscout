import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/GigRepository";

export function useGigs() {
    return useQuery({
        queryKey: ["gigs"],
        queryFn: () =>
            GigRepository.getAll(),
    });
}