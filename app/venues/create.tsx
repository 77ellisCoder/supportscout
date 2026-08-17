import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
    VenueForm,
    type VenueFormValues,
} from "../../components/venues/VenueForm";

import { VenueRepository } from "../../repositories/VenueRepository";

export default function CreateVenueScreen() {
    const queryClient = useQueryClient();

    const [saving, setSaving] = useState(false);
    const [error, setError] =
        useState<string | null>(null);

    async function handleSubmit(
        values: VenueFormValues
    ) {
        if (!values.venueName.trim()) {
            setError("Venue name is required.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const capacity =
                values.capacity.trim()
                    ? Number(values.capacity)
                    : null;

            if (
                capacity != null &&
                !Number.isFinite(capacity)
            ) {
                setError(
                    "Capacity must be a valid number."
                );

                return;
            }

            const venueId =
                await VenueRepository.create({
                    venueName:
                        values.venueName.trim(),

                    suburb:
                        values.suburb.trim() || null,

                    address:
                        values.address.trim() || null,

                    capacity,

                    venueType:
                        values.venueType.trim() || null,

                    websiteUrl:
                        values.websiteUrl.trim() || null,

                    bookingUrl:
                        values.bookingUrl.trim() || null,

                    bookingEmail:
                        values.bookingEmail.trim() || null,

                    shortDescription:
                        values.shortDescription.trim() ||
                        null,

                    internalNotes:
                        values.internalNotes.trim() ||
                        null,

                    status: values.status,

                    isVerified:
                        values.isVerified,
                });

            await queryClient.invalidateQueries({
                queryKey: ["venues"],
            });

            router.replace(
                `/venues/${venueId}`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create venue."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <VenueForm
            eyebrow="NEW VENUE"
            title="Add a venue"
            submitLabel="Create Venue"
            saving={saving}
            error={error}
            onSubmit={handleSubmit}
        />
    );
}