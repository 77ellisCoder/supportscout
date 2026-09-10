import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { BandAppearanceList } from "../../components/venues/BandAppearanceList";
import { GigSection } from "../../components/gigs/GigSection";
import { Button } from "../../components/ui/Button";
import { ScreenActionBar } from "../../components/ui/ScreenActionBar";

import { useVenue } from "../../hooks/useVenue";
import { useVenueBands } from "../../hooks/useVenueBands";
import { useVenueGigs } from "../../hooks/useVenueGigs";

import { styles } from "../../styles/venue-details.styles";
import { colors } from "../../theme";

export default function VenueDetailsScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

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
        <ActivityIndicator
          color={colors.primaryLight}
        />

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
          {error
            ? error.message
            : "Venue not found."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.container}
      >
        {/* Hero */}
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
                <Text style={styles.metaDot}>
                  •
                </Text>

                <Text style={styles.meta}>
                  {formatVenueType(
                    venue.venueType
                  )}
                </Text>
              </>
            )}

            {venue.capacity != null && (
              <>
                <Text style={styles.metaDot}>
                  •
                </Text>

                <Text style={styles.meta}>
                  {venue.capacity} capacity
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Address */}
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

        {/* Status */}
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

        {/* Venue details */}
        {(venue.venueType ||
          venue.capacity != null) && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                VENUE DETAILS
              </Text>

              <View style={styles.inlineRow}>
                {venue.venueType && (
                  <View
                    style={styles.inlineFieldWide}
                  >
                    <DetailRow
                      label="Venue Type"
                      value={formatVenueType(
                        venue.venueType
                      )}
                    />
                  </View>
                )}

                {venue.capacity != null && (
                  <View style={styles.inlineField}>
                    <DetailRow
                      label="Capacity"
                      value={String(
                        venue.capacity
                      )}
                    />
                  </View>
                )}
              </View>
            </View>
          )}

        {/* Contact */}
        {(venue.websiteUrl ||
          venue.bookingUrl ||
          venue.bookingEmail) && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                CONTACT & BOOKING
              </Text>

              {venue.websiteUrl && (
                <ContactLink
                  label="Website"
                  value="Open ↗"
                  url={venue.websiteUrl}
                />
              )}

              {venue.bookingUrl && (
                <ContactLink
                  label="Booking"
                  value="Open ↗"
                  url={venue.bookingUrl}
                />
              )}

              {venue.bookingEmail && (
                <ContactLink
                  label="Booking email"
                  value={venue.bookingEmail}
                  url={`mailto:${venue.bookingEmail}`}
                />
              )}
            </View>
          )}

        {/* Notes */}
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

        {/* Gigs */}
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

        {/* Bands */}
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
              No bands recorded at this
              venue yet.
            </Text>
          ) : (
            <BandAppearanceList
              bands={venueBands}
            />
          )}
        </View>
      </ScrollView>

      <ScreenActionBar>
        <Button
          title="Edit Venue"
          variant="primary"
          onPress={() =>
            router.push(
              `/venues/edit?id=${venueId}`
            )
          }
        />
      </ScreenActionBar>
    </View>
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

type ContactLinkProps = {
  label: string;
  value: string;
  url: string;
};

function ContactLink({
  label,
  value,
  url,
}: ContactLinkProps) {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      style={styles.linkRow}
    >
      <Text style={styles.linkLabel}>
        {label}
      </Text>

      <Text style={styles.linkText}>
        {value}
      </Text>
    </Pressable>
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