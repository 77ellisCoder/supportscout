import type { Genre } from "../models/Genre";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

export const WebGenreRepository = {
    async getAll(search?: string): Promise<Genre[]> {
        const response = await fetch(`${API_URL}/genres`);

        if (!response.ok) {
            throw new Error(
                `Unable to load genres (${response.status})`
            );
        }

        const genres: Genre[] = await response.json();

        const query = search?.trim().toLowerCase();

        if (!query) {
            return genres;
        }

        return genres.filter((genre) =>
            genre.name.toLowerCase().includes(query)
        );
    },

    async getById(id: number): Promise<Genre | null> {
        const response = await fetch(
            `${API_URL}/genres/${id}`
        );

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                `Unable to load genre (${response.status})`
            );
        }

        return response.json();
    },

    async getByIds(ids: number[]): Promise<Genre[]> {
        if (ids.length === 0) {
            return [];
        }

        const genres = await this.getAll();
        const idSet = new Set(ids);

        return genres.filter((genre) =>
            idSet.has(genre.id)
        );
    },
};