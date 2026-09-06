import { useQuery } from "@tanstack/react-query";

import { GenreRepository } from "../repositories/GenreRepository";

export function useGenres() {
    return useQuery({
        queryKey: ["genres"],
        queryFn: () => GenreRepository.getAll(),
    });
}

export function useGenre(id: number) {
    return useQuery({
        queryKey: ["genre", id],
        queryFn: () => GenreRepository.getById(id),
        enabled: Number.isFinite(id),
    });
}

export function useGenresByIds(genreIds: number[]) {
    return useQuery({
        queryKey: ["genres", genreIds],
        queryFn: () => GenreRepository.getByIds(genreIds),
        enabled: genreIds.length > 0,
    });
}