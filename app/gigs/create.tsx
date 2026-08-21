import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
    GigForm,
    type GigFormValues,
} from "../../components/gigs/GigForm";

import { useBands } from "../../hooks/useBands";
import { useVenues } from "../../hooks/useVenues";

import { GigRepository } from "../../repositories/GigRepository";

export default function CreateGigScreen() {
    const queryClient = useQueryClient();

    const {
        data: bands = [],
    } = useBands("");

    const {
        data: venues = [],
    } = useVenues();

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        values: GigFormValues
    ) {
        if (!values.gigDate.trim()) {
            setError("Gig date is required.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const createdGig =
                await GigRepository.create({
                    venueId: values.venueId,

                    gigDate:
                        values.gigDate.trim(),

                    eventName:
                        values.eventName.trim() || null,

                    notes:
                        values.notes.trim() || null,

                    status:
                        values.status,

                    lineup:
                        values.lineup,
                });

            queryClient.setQueryData(
                ["gigs", createdGig.gigId],
                createdGig
            );

            await queryClient.invalidateQueries({
                queryKey: ["gigs"],
            });

            router.replace(
                `/gigs/${createdGig.gigId}`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create gig."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <GigForm
            eyebrow="NEW GIG"
            title="Add a gig"
            submitLabel="Create Gig"
            bands={bands}
            venues={venues}
            saving={saving}
            error={error}
            onSubmit={handleSubmit}
        />
    );
}