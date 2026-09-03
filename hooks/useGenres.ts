import { useQuery } from "@tanstack/react-query";

import { GenreRepository } from "../repositories/GenreRepository";

export function useGenres() {
    return useQuery({
        queryKey: ["genres"],
        queryFn: () => GenreRepository.getAll(),
    });
}