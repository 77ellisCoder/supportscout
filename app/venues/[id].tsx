import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useVenue } from "../../hooks/useVenue";
import { colors } from "../../theme";
import { styles } from "../../styles/venue-details.styles";
import { BackButton } from "../../components/navigation/BackButton";
import { GigSection } from "../../components/gigs/GigSection";
import { BandAppearanceList } from "../../components/venues/BandAppearanceList";
import { Button } from "../../components/Button/Button";

import { useVenueGigs } from "../../hooks/useVenueGigs";
import { useVenueBands } from "../../hooks/useVenueBands";

export default function VenueDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const venueId = Number(id);

  const {
    data: venue,
    isLoading,
    error,
  } = useVenue(venueId);

  const {
    data: upcomingGigs = [],
    isLoading: upcomingGigsLoading,
  } = useVenueGigs(
    venueId,
    "upcoming"
  );

  const {
    data: recentGigs = [],
    isLoading: recentGigsLoading,
  } = useVenueGigs(
    venueId,
    "past"
  );

  const {
    data: venueBands = [],
    isLoading: venueBandsLoading,
  } = useVenueBands(venueId);

  if (isLoading) {
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
          {error ? error.message : "Venue not found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <BackButton
          label="Back to Venues"
          fallbackRoute="/venues"
        />
      </View>

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
          {venue.suburb && (
            <Text style={styles.meta}>
              {venue.suburb}
            </Text>
          )}

          {venue.venueType && (
            <>
              <Text style={styles.metaDot}>•</Text>

              <Text style={styles.meta}>
                {formatVenueType(venue.venueType)}
              </Text>
            </>
          )}

          {venue.capacity != null && (
            <>
              <Text style={styles.metaDot}>•</Text>

              <Text style={styles.meta}>
                {venue.capacity} capacity
              </Text>
            </>
          )}
        </View>
      </View>

      {venue.address && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            ADDRESS
          </Text>

          <Text style={styles.bodyText}>
            {venue.address}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          STATUS
        </Text>

        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {venue.status.toUpperCase()}
            </Text>
          </View>

          {venue.isVerified && (
            <Text style={styles.verifiedInline}>
              Verified
            </Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          VENUE DETAILS
        </Text>

        <DetailRow
          label="Type"
          value={
            venue.venueType
              ? formatVenueType(venue.venueType)
              : "Not recorded"
          }
        />

        <DetailRow
          label="Capacity"
          value={
            venue.capacity != null
              ? String(venue.capacity)
              : "Not recorded"
          }
        />
      </View>

      {(venue.websiteUrl ||
        venue.bookingUrl ||
        venue.bookingEmail) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              CONTACT & BOOKING
            </Text>

            {venue.websiteUrl && (
              <Pressable
                onPress={() =>
                  Linking.openURL(venue.websiteUrl!)
                }
                style={styles.linkRow}
              >
                <Text style={styles.linkLabel}>
                  Website
                </Text>

                <Text style={styles.linkText}>
                  Open ↗
                </Text>
              </Pressable>
            )}

            {venue.bookingUrl && (
              <Pressable
                onPress={() =>
                  Linking.openURL(venue.bookingUrl!)
                }
                style={styles.linkRow}
              >
                <Text style={styles.linkLabel}>
                  Booking
                </Text>

                <Text style={styles.linkText}>
                  Open ↗
                </Text>
              </Pressable>
            )}

            {venue.bookingEmail && (
              <Pressable
                onPress={() =>
                  Linking.openURL(
                    `mailto:${venue.bookingEmail}`
                  )
                }
                style={styles.linkRow}
              >
                <Text style={styles.linkLabel}>
                  Booking email
                </Text>

                <Text style={styles.linkText}>
                  {venue.bookingEmail}
                </Text>
              </Pressable>
            )}
          </View>
        )}

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

      <GigSection
        title="UPCOMING GIGS"
        gigs={upcomingGigs}
        loading={upcomingGigsLoading}
        emptyMessage="No upcoming gigs recorded at this venue."
      />

      <GigSection
        title="RECENT GIGS"
        gigs={recentGigs}
        loading={recentGigsLoading}
        emptyMessage="No past gigs recorded at this venue."
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          BANDS PLAYED HERE
        </Text>

        {venueBandsLoading ? (
          <ActivityIndicator
            color={colors.primaryLight}
          />
        ) : venueBands.length === 0 ? (
          <Text style={styles.bodyText}>
            No bands recorded at this venue yet.
          </Text>
        ) : (
          <BandAppearanceList bands={venueBands} />
        )}
      </View>

      <View style={styles.actions}>
        {/* Edit button */}
        <Button
          title="Edit Venue"
          onPress={() =>
            router.push({
              pathname: "/venues/edit",
              params: {
                id: venue.venueId,
              },
            })
          }
        />
      </View>
    </ScrollView>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

function formatVenueType(
  venueType: string
): string {
  return venueType
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}