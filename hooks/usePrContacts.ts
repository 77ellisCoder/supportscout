import { useQuery } from "@tanstack/react-query";

import { WebPrContactRepository } from "../repositories/WebPrContactRepository";

export function usePrContacts() {
    return useQuery({
        queryKey: ["pr-contacts"],
        queryFn: () =>
            WebPrContactRepository.getAll(),
        staleTime: 5 * 60 * 1000,
    });
}