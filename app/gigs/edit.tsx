import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";

import {
  GigForm,
  type GigFormValues,
} from "../../components/gigs/GigForm";

import type { LineupRole } from "../../components/gigs/LineupBuilder";

import { useBands } from "../../hooks/useBands";
import { useGigDetail } from "../../hooks/useGigDetail";
import { useVenues } from "../../hooks/useVenues";

import { GigRepository } from "../../repositories/GigRepository";
import { colors } from "../../theme";

export default function EditGigScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const gigId = Number(id);

  const queryClient = useQueryClient();

  const {
    data: gig,
    isLoading: gigLoading,
    error: gigError,
  } = useGigDetail(gigId);

  const {
    data: bands = [],
    isLoading: bandsLoading,
  } = useBands("");

  const {
    data: venues = [],
    isLoading: venuesLoading,
  } = useVenues();

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  if (
    gigLoading ||
    bandsLoading ||
    venuesLoading
  ) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator
          color={colors.primaryLight}
        />

        <Text
          style={{
            color: colors.textSecondary,
            marginTop: 12,
          }}
        >
          Loading gig...
        </Text>
      </View>
    );
  }

  if (gigError || !gig) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
          padding: 24,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Unable to load gig.
        </Text>
      </View>
    );
  }

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

      await GigRepository.update(
        gigId,
        {
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
        }
      );

      await queryClient.invalidateQueries({
        queryKey: ["gigs"],
      });

      // Navigate back to the gig details page after saving
      router.back();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save gig."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <GigForm
      eyebrow="EDIT GIG"
      title="Gig details"
      submitLabel="Save Gig"

      initialValues={{
        eventName:
          gig.eventName ?? "",

        gigDate:
          gig.gigDate,

        venueId:
          gig.venueId,

        status:
          gig.status,

        notes:
          gig.notes ?? "",

        lineup:
          gig.bands.map((band) => ({
            bandId: band.bandId,

            role:
              (band.role as LineupRole) ??
              "support",
          })),
      }}

      bands={bands}
      venues={venues}

      saving={saving}
      error={error}

      onSubmit={handleSubmit}
    />
  );
}