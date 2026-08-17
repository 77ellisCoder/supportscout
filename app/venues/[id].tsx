import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import type { Venue } from "../../models/Venue";
import { VenueRepository } from "../../repositories/VenueRepository";
import { colors } from "../../theme";
import { styles } from "../../styles/venue-details.styles";

export default function VenueDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVenue() {
      try {
        setLoading(true);
        setError(null);

        const venueId = Number(id);

        if (!Number.isFinite(venueId)) {
          throw new Error("Invalid venue ID.");
        }

        const result = await VenueRepository.getById(venueId);

        if (!result) {
          throw new Error("Venue not found.");
        }

        setVenue(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load venue."
        );
      } finally {
        setLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primaryLight} />
        <Text style={styles.loadingText}>
          Loading venue...
        </Text>
      </View>
    );
  }

  if (error || !venue) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load venue
        </Text>

        <Text style={styles.errorText}>
          {error ?? "Venue not found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
    >
      <View style={styles.hero}>
        <View style={styles.titleRow}>
          <View style={styles.titleContent}>
            <Text style={styles.eyebrow}>
              VENUE PROFILE
            </Text>

            <Text style={styles.title}>
              {venue.venueName}
            </Text>

            {venue.shortDescription && (
              <Text style={styles.description}>
                {venue.shortDescription}
              </Text>
            )}
          </View>

          {venue.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>
                VERIFIED
              </Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {venue.hometown ?? "Perth"}
          </Text>

          {venue.stateRegion && (
            <>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.meta}>
                {venue.stateRegion}
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          STATUS
        </Text>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {venue.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {venue.internalNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            NOTES
          </Text>

          <Text style={styles.bodyText}>
            {venue.internalNotes}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/venues/edit",
              params: { id: venue.venueId },
            })
          }
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.editButtonPressed,
          ]}
        >
          <Text style={styles.editButtonText}>
            Edit Venue
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}