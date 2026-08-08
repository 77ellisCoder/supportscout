import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import type { Band } from "../../models/Band";
import { BandRepository } from "../../repositories/BandRepository";
import { colors } from "../../theme";
import { styles } from "../../styles/band-details.styles";

export default function BandDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [band, setBand] = useState<Band | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBand() {
      try {
        setLoading(true);
        setError(null);

        const bandId = Number(id);

        if (!Number.isFinite(bandId)) {
          throw new Error("Invalid band ID.");
        }

        const result = await BandRepository.getById(bandId);

        if (!result) {
          throw new Error("Band not found.");
        }

        setBand(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load band."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBand();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primaryLight} />
        <Text style={styles.loadingText}>
          Loading band...
        </Text>
      </View>
    );
  }

  if (error || !band) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load band
        </Text>

        <Text style={styles.errorText}>
          {error ?? "Band not found."}
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
              BAND PROFILE
            </Text>

            <Text style={styles.title}>
              {band.bandName}
            </Text>

            {band.shortDescription && (
              <Text style={styles.description}>
                {band.shortDescription}
              </Text>
            )}
          </View>

          {band.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>
                VERIFIED
              </Text>
            </View>
          )}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {band.hometown ?? "Perth"}
          </Text>

          {band.stateRegion && (
            <>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.meta}>
                {band.stateRegion}
              </Text>
            </>
          )}

          {band.memberCount != null && (
            <>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.meta}>
                {band.memberCount}{" "}
                {band.memberCount === 1
                  ? "member"
                  : "members"}
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
            {band.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {band.internalNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            NOTES
          </Text>

          <Text style={styles.bodyText}>
            {band.internalNotes}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/bands/edit",
              params: { id: band.bandId },
            })
          }
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.editButtonPressed,
          ]}
        >
          <Text style={styles.editButtonText}>
            Edit Band
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}