import { Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { GenreRepository } from "../repositories/Repository";

export function useGenres(search = "") {
    return useQuery({
        queryKey: [
            "genres",
            "all",
            search,
        ],

        queryFn: () => {
            return GenreRepository.getAll(
                search
            );
        },

        staleTime: 5 * 60 * 1000,
    });
}

export function useGenre(id: number) {
    return useQuery({
        queryKey: [
            "genre",
            id,
        ],

        queryFn: () => {

            return GenreRepository.getById(
                id
            );
        },

        enabled:
            Number.isFinite(id) &&
            id > 0,
    });
}

export function useGenresByIds(
    ids: number[]
) {
    return useQuery({
        queryKey: [
            "genres",
            "ids",
            ids,
        ],

        queryFn: () =>
            GenreRepository.getByIds(ids),

        enabled:
            Platform.OS !== "web" &&
            ids.length > 0,
    });
}

export function useGenresByBandId(
    bandId: number
) {
    return useQuery({
        queryKey: [
            "genres",
            "band",
            bandId,
        ],

        queryFn: () =>
            GenreRepository.getByBandId(
                bandId
            ),

        enabled:
            Platform.OS !== "web" &&
            Number.isFinite(bandId) &&
            bandId > 0,
    });
}