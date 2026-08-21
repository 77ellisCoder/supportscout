import { router, useLocalSearchParams } from "expo-router";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { BackButton } from "../../components/navigation/BackButton";
import { useBand } from "../../hooks/useBand";
import { useBandGigs } from "../../hooks/useBandGigs";
import type { GigListItem } from "../../models/Gig";
import { styles } from "../../styles/band-details.styles";
import { colors } from "../../theme";

export default function BandDetailsScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const bandId = Number(id);

  const {
    data: band,
    isLoading,
    error,
  } = useBand(bandId);

  const {
    data: upcomingGigs = [],
    isLoading: upcomingGigsLoading,
  } = useBandGigs(
    bandId,
    "upcoming"
  );

  const {
    data: recentGigs = [],
    isLoading: recentGigsLoading,
  } = useBandGigs(
    bandId,
    "past"
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          color={colors.primaryLight}
        />

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
          {error
            ? error.message
            : "Band not found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
    >
      <BackButton
        label="Back to Bands"
        fallbackRoute="/bands"
      />

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
              <Text style={styles.metaDot}>
                •
              </Text>

              <Text style={styles.meta}>
                {band.stateRegion}
              </Text>
            </>
          )}

          {band.memberCount != null && (
            <>
              <Text style={styles.metaDot}>
                •
              </Text>

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

      <GigSection
        title="UPCOMING GIGS"
        gigs={upcomingGigs}
        loading={upcomingGigsLoading}
        emptyMessage="No upcoming gigs recorded."
      />

      <GigSection
        title="RECENT GIGS"
        gigs={recentGigs}
        loading={recentGigsLoading}
        emptyMessage="No past gigs recorded."
      />

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
              params: {
                id: band.bandId,
              },
            })
          }
          style={({ pressed }) => [
            styles.editButton,
            pressed &&
            styles.editButtonPressed,
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

type GigSectionProps = {
  title: string;
  gigs: GigListItem[];
  loading: boolean;
  emptyMessage: string;
};

function GigSection({
  title,
  gigs,
  loading,
  emptyMessage,
}: GigSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>
        {title}
      </Text>

      {loading ? (
        <ActivityIndicator
          color={colors.primaryLight}
        />
      ) : gigs.length === 0 ? (
        <Text style={styles.bodyText}>
          {emptyMessage}
        </Text>
      ) : (
        <View style={styles.gigList}>
          {gigs.map((gig) => (
            <GigRow
              key={gig.gigId}
              gig={gig}
            />
          ))}
        </View>
      )}
    </View>
  );
}

type GigRowProps = {
  gig: GigListItem;
};

function GigRow({
  gig,
}: GigRowProps) {
  return (
    <Pressable
      onPress={() =>
        router.push(
          `/gigs/${gig.gigId}`
        )
      }
      style={({ pressed }) => [
        styles.gigRow,
        pressed &&
        styles.gigRowPressed,
      ]}
    >
      <View style={styles.gigDate}>
        <Text style={styles.gigDateDay}>
          {formatGigDay(gig.gigDate)}
        </Text>

        <Text style={styles.gigDateMonth}>
          {formatGigMonth(
            gig.gigDate
          )}
        </Text>
      </View>

      <View style={styles.gigContent}>
        <Text style={styles.gigTitle}>
          {gig.eventName ||
            gig.venueName ||
            "Gig"}
        </Text>

        {gig.venueName && (
          <Text style={styles.gigVenue}>
            {gig.venueName}
            {gig.suburb
              ? ` · ${gig.suburb}`
              : ""}
          </Text>
        )}

        <Text style={styles.gigMeta}>
          {gig.bandCount}{" "}
          {gig.bandCount === 1
            ? "band"
            : "bands"}
        </Text>
      </View>

      <Text style={styles.chevron}>
        ›
      </Text>
    </Pressable>
  );
}

function parseGigDate(
  value: string
): Date {
  const [year, month, day] =
    value.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day
  );
}

function formatGigDay(
  value: string
): string {
  return String(
    parseGigDate(value).getDate()
  );
}

function formatGigMonth(
  value: string
): string {
  return parseGigDate(value)
    .toLocaleDateString("en-AU", {
      month: "short",
    })
    .toUpperCase();
}