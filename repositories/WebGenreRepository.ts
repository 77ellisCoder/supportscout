import type { Genre } from "../models/Genre";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

async function parseResponse<T>(
    response: Response
): Promise<T> {
    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.error ??
            "Genre API request failed"
        );
    }

    return result as T;
}

export const WebGenreRepository = {
    async getAll(
        search?: string
    ): Promise<Genre[]> {
        const response = await fetch(
            `${API_URL}/genres`
        );

        const genres =
            await parseResponse<Genre[]>(
                response
            );

        const term =
            search?.trim().toLowerCase();

        if (!term) {
            return genres;
        }

        return genres.filter((genre) =>
            genre.name
                .toLowerCase()
                .includes(term)
        );
    },

    async getById(
        genreId: number
    ): Promise<Genre | null> {
        const response = await fetch(
            `${API_URL}/genres/${genreId}`
        );

        if (response.status === 404) {
            return null;
        }

        return parseResponse<Genre>(
            response
        );
    },
};