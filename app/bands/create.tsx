import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
    BandForm,
    type BandFormValues,
} from "../../components/bands/BandForm";

import { BandRepository } from "../../repositories/BandRepository";

export default function CreateBandScreen() {
    const queryClient = useQueryClient();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(
        values: BandFormValues
    ) {
        if (!values.bandName.trim()) {
            setError("Band name is required.");
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const memberCount =
                values.memberCount.trim()
                    ? Number(values.memberCount)
                    : null;

            const formationYear =
                values.formationYear.trim()
                    ? Number(values.formationYear)
                    : null;

            if (
                memberCount != null &&
                !Number.isFinite(memberCount)
            ) {
                setError(
                    "Member count must be a valid number."
                );
                return;
            }

            if (
                formationYear != null &&
                !Number.isFinite(formationYear)
            ) {
                setError(
                    "Formation year must be a valid number."
                );
                return;
            }

            const createdBand = await BandRepository.create({
                bandName: values.bandName.trim(),

                slug:
                    values.slug.trim() || null,

                hometown:
                    values.hometown.trim() || null,

                stateRegion:
                    values.stateRegion.trim() ||
                    "Western Australia",

                countryCode:
                    values.countryCode.trim() || "AU",

                memberCount,

                formationYear,

                shortDescription:
                    values.shortDescription.trim() || null,

                internalNotes:
                    values.internalNotes.trim() || null,

                status: values.status,

                isOurBand: values.isOurBand,

                isVerified: values.isVerified,
                
                bookingContactName:
                    values.bookingContactName.trim() || null,

                contactEmail:
                    values.contactEmail.trim() || null,

                facebookUrl:
                    values.facebookUrl.trim() || null,

                instagramUrl:
                    values.instagramUrl.trim() || null,

                websiteUrl:
                    values.websiteUrl.trim() || null
            });

            queryClient.setQueryData(
                ["bands", createdBand.bandId],
                createdBand
            );

            await queryClient.invalidateQueries({
                queryKey: ["bands"],
            });

            router.replace(
                `/bands/${createdBand.bandId}`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to create band."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <BandForm
            eyebrow="NEW BAND"
            title="Add a band"
            submitLabel="Create Band"
            saving={saving}
            error={error}
            onSubmit={handleSubmit}
        />
    );
}