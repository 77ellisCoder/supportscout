import { router } from "expo-router";
import { useMemo } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { BackButton } from "../../components/navigation/BackButton/BackButton";

import { useGigs } from "../../hooks/useGigs";
import { colors } from "../../theme";
import { styles } from "../../styles/gigs.styles";

export default function GigsScreen() {
  const {
    data: gigs = [],
    isLoading,
    error,
  } = useGigs();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingGigs = useMemo(() => {
    return gigs
      .filter((gig) => {
        const date = new Date(gig.gigDate);

        return date >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.gigDate).getTime() -
          new Date(b.gigDate).getTime()
      );
  }, [gigs]);

  const pastGigs = useMemo(() => {
    return gigs
      .filter((gig) => {
        const date = new Date(gig.gigDate);

        return date < today;
      })
      .sort(
        (a, b) =>
          new Date(b.gigDate).getTime() -
          new Date(a.gigDate).getTime()
      );
  }, [gigs]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          color={colors.primaryLight}
        />

        <Text style={styles.loadingText}>
          Loading gigs...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Couldn't load gigs
        </Text>

        <Text style={styles.errorText}>
          Something went wrong while loading gig data.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.page}
      contentContainerStyle={styles.container}
      data={[]}
      renderItem={() => null}
      ListHeaderComponent={
        <>
          <View style={styles.header}>

            <BackButton 
              label="" 
              fallbackRoute="/"
            />

            <View style={styles.headerText}>
              <Text style={styles.eyebrow}>
                GIGS
              </Text>

              <Text style={styles.title}>
                Plan the next show.
              </Text>

              <Text style={styles.subtitle}>
                Track upcoming and past gigs across
                SupportScout.
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add gig"
              onPress={() =>
                router.push("/gigs/create")
              }
              style={({ pressed }) => [
                styles.addButton,
                pressed &&
                styles.addButtonPressed,
              ]}
            >
              <Text style={styles.addButtonText}>
                + Add Gig
              </Text>
            </Pressable>
          </View>

          <GigSection
            title="UPCOMING GIGS"
            gigs={upcomingGigs}
            emptyMessage="No upcoming gigs yet."
          />

          <GigSection
            title="PAST GIGS"
            gigs={pastGigs}
            emptyMessage="No past gigs yet."
          />
        </>
      }
    />
  );
}

type GigSectionProps = {
  title: string;
  gigs: ReturnType<typeof useGigs>["data"];
  emptyMessage: string;
};

function GigSection({
  title,
  gigs = [],
  emptyMessage,
}: GigSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Text style={styles.sectionCount}>
          {gigs.length}
        </Text>
      </View>

      {gigs.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            {emptyMessage}
          </Text>
        </View>
      ) : (
        <View style={styles.gigList}>
          {gigs.map((gig) => (
            <Pressable
              key={gig.gigId}
              onPress={() =>
                router.push(
                  `/gigs/${gig.gigId}`
                )
              }
              style={({ pressed }) => [
                styles.gigCard,
                pressed &&
                styles.gigCardPressed,
              ]}
            >
              <View style={styles.gigContent}>
                <Text style={styles.gigDate}>
                  {formatGigDate(gig.gigDate)}
                </Text>

                <Text style={styles.gigTitle}>
                  {gig.eventName ||
                    gig.venueName ||
                    "Untitled Gig"}
                </Text>

                <View style={styles.metaRow}>
                  {gig.venueName && (
                    <Text style={styles.meta}>
                      {gig.venueName}
                    </Text>
                  )}

                  {gig.suburb && (
                    <>
                      <Text style={styles.metaDot}>
                        •
                      </Text>

                      <Text style={styles.meta}>
                        {gig.suburb}
                      </Text>
                    </>
                  )}

                  <Text style={styles.metaDot}>
                    •
                  </Text>

                  <Text style={styles.meta}>
                    {gig.bandCount}{" "}
                    {gig.bandCount === 1
                      ? "band"
                      : "bands"}
                  </Text>
                </View>
              </View>

              <Text style={styles.chevron}>
                ›
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

function formatGigDate(
  value: string
): string {
  const date = new Date(value);

  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}