import { Platform } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { GenreRepository } from "../repositories/GenreRepository";
import { WebGenreRepository } from "../repositories/WebGenreRepository";

export function useGenres(search = "") {
    return useQuery({
        queryKey: [
            "genres",
            "all",
            search,
        ],

        queryFn: () => {
            if (Platform.OS === "web") {
                return WebGenreRepository.getAll(
                    search
                );
            }

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
            if (Platform.OS === "web") {
                return WebGenreRepository.getById(
                    id
                );
            }

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