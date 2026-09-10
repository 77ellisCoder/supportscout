import { useQuery } from "@tanstack/react-query";

import { PrContactRepository } from "../repositories/Repository";

export function usePrContacts() {
    return useQuery({
        queryKey: ["pr-contacts"],
        queryFn: () =>
            PrContactRepository.getAll(),
        staleTime: 5 * 60 * 1000,
    });
}