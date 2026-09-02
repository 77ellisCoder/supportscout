import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  BandForm,
  type BandFormValues,
} from "../../components/bands/BandForm";

import { useBand } from "../../hooks/useBand";
import { BandRepository } from "../../repositories/BandRepository";

export default function EditBandScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const bandId = Number(id);

  const queryClient = useQueryClient();

  const {
    data: band,
    isLoading,
  } = useBand(bandId);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  if (isLoading || !band) {
    return null;
  }

  async function handleSubmit(
    values: BandFormValues
  ) {
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

      await BandRepository.update(
        bandId,
        {
          bandName:
            values.bandName.trim(),

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
            values.shortDescription.trim() ||
            null,

          internalNotes:
            values.internalNotes.trim() ||
            null,

          status:
            values.status,

          isOurBand:
            values.isOurBand,

          isVerified:
            values.isVerified,

          bookingContactName:
            values.bookingContactName.trim() ||
            null,

          contactEmail:
            values.contactEmail.trim() ||
            null,

          facebookUrl:
            values.facebookUrl.trim() ||
            null,

          instagramUrl:
            values.instagramUrl.trim() ||
            null,

          websiteUrl:
            values.websiteUrl.trim() ||
            null
        }
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["bands"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["band", bandId],
        }),
      ]);

      // Navigate back to the band details page after saving
      router.back();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save band."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <BandForm
      eyebrow="EDIT BAND"
      title="Band details"
      submitLabel="Save Band"

      initialValues={{
        bandName:
          band.bandName,

        slug:
          band.slug ?? "",

        hometown:
          band.hometown ?? "",

        stateRegion:
          band.stateRegion ?? "Western Australia",

        countryCode:
          band.countryCode ?? "AU",

        memberCount:
          band.memberCount != null
            ? String(band.memberCount)
            : "",

        formationYear:
          band.formationYear != null
            ? String(band.formationYear)
            : "",

        shortDescription:
          band.shortDescription ?? "",

        internalNotes:
          band.internalNotes ?? "",

        status:
          band.status,

        isOurBand:
          band.isOurBand,

        isVerified:
          band.isVerified,

        bookingContactName:
          band.bookingContactName ?? "",

        contactEmail:
          band.contactEmail ?? "",

        facebookUrl:
          band.facebookUrl ?? "",

        instagramUrl:
          band.instagramUrl ?? "",

        websiteUrl:
          band.websiteUrl ?? "",
      }}

      saving={saving}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}