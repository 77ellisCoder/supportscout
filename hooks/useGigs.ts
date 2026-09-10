import { useQuery } from "@tanstack/react-query";

import { GigRepository } from "../repositories/Repository";

export function useGigs() {
    return useQuery({
        queryKey: ["gigs"],
        queryFn: () =>
            GigRepository.getAll(),
    });
}