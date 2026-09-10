import { useQuery } from "@tanstack/react-query";

import { GenreRepository } from "../repositories/Repository";

export function useGenre(id: number) {
    return useQuery({
        queryKey: ["genre", id],

        queryFn: () =>
            GenreRepository.getById(id),

        enabled: Number.isFinite(id),
    });
}