import { useQuery } from "@tanstack/react-query";

import { GenreRepository } from "../repositories/GenreRepository";

export function useGenres(search = "") {
  return useQuery({
    queryKey: ["genres", search],
    queryFn: () => GenreRepository.getAll(search),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGenre(id: number) {
    return useQuery({
        queryKey: ["genre", id],
        queryFn: () => GenreRepository.getById(id),
        enabled: Number.isFinite(id),
    });
}

export function useGenresByIds(ids: number[]) {
    return useQuery({
        queryKey: ["genres", ids],
        queryFn: () => GenreRepository.getByIds(ids),
        enabled: ids.length > 0,
    });
}

export function useGenresByBandId(bandId: number) {
    return useQuery({
        queryKey: ["genres", bandId],
        queryFn: () => GenreRepository.getByBandId(bandId),
        enabled: Number.isFinite(bandId),
    });
}