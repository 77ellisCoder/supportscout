import { router, useLocalSearchParams } from "expo-router";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { BackButton } from "../../components/navigation/BackButton";
import { GigSection } from "../../components/gigs/GigSection";

import { useBand } from "../../hooks/useBand";
import { useBandGigs } from "../../hooks/useBandGigs";
import { useBandRecommendations } from "../../hooks/useBandRecommendations";

import { detailStyles as styles } from "../../styles/shared/details.styles";
import { colors } from "../../theme";
import { BandRecommendationCard } from "../../components/bands/BandRecommendationCard";

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

  const {
    data: recommendations = [],
    isLoading: recommendationsLoading,
  } = useBandRecommendations(bandId);

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

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
            SUPPORTSCOUT MATCHES
        </Text>

        {recommendationsLoading ? (
            <ActivityIndicator
                color={colors.primaryLight}
            />
        ) : recommendations.length === 0 ? (
            <Text style={styles.bodyText}>
                Not enough gig history yet to suggest matches.
            </Text>
        ) : (
            <View style={styles.list}>
                {recommendations.map(
                    (recommendation) => (
                        <BandRecommendationCard
                            key={recommendation.bandId}
                            recommendation={recommendation}
                        />
                    )
                )}
            </View>
        )}
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