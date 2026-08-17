import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  VenueForm,
  type VenueFormValues,
} from "../../components/venues/VenueForm";

import { useVenue } from "../../hooks/useVenue";
import { VenueRepository } from "../../repositories/VenueRepository";

export default function EditVenueScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const venueId = Number(id);

  const queryClient = useQueryClient();

  const {
    data: venue,
    isLoading,
  } = useVenue(venueId);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  if (isLoading || !venue) {
    return null;
  }

  async function handleSubmit(
    values: VenueFormValues
  ) {
    try {
      setSaving(true);
      setError(null);

      const capacity =
        values.capacity.trim()
          ? Number(values.capacity)
          : null;

      await VenueRepository.update(
        venueId,
        {
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

          status:
            values.status,

          isVerified:
            values.isVerified,
        }
      );

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
          : "Unable to save venue."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <VenueForm
      eyebrow="EDIT VENUE"
      title="Venue details"
      submitLabel="Save Venue"

      initialValues={{
        venueName: venue.venueName,
        suburb: venue.suburb ?? "",
        address: venue.address ?? "",

        capacity:
          venue.capacity != null
            ? String(venue.capacity)
            : "",

        venueType:
          venue.venueType ?? "",

        websiteUrl:
          venue.websiteUrl ?? "",

        bookingUrl:
          venue.bookingUrl ?? "",

        bookingEmail:
          venue.bookingEmail ?? "",

        shortDescription:
          venue.shortDescription ?? "",

        internalNotes:
          venue.internalNotes ?? "",

        status:
          venue.status,

        isVerified:
          venue.isVerified,
      }}

      saving={saving}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}