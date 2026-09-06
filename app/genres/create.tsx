import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
    GenreForm,
    type GenreFormValues,
} from "../../components/genres/GenreForm";

import { GenreRepository } from "../../repositories/GenreRepository";

export default function CreateGenreScreen() {
    const queryClient = useQueryClient();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(
        values: GenreFormValues
    ) {
        if (!values.genreName.trim()) {
            setError("Genre name is required.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const createdGenreId = await GenreRepository.create(
                values.genreName.trim()
            );

            queryClient.setQueryData(
                ["genreID", createdGenreId],
                createdGenreId
            );

            await queryClient.invalidateQueries({
                queryKey: ["genres"],
            });

            router.replace(
                `/genres/${createdGenreId}`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create genre."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <GenreForm
            eyebrow="NEW GENRE"
            title="Add a genre"
            submitLabel="Create Genre"
            saving={saving}
            error={error}
            onSubmit={handleSubmit}
        />
    );
}