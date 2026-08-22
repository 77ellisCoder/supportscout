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
import { GigSection } from "../../components/gigs/GigSection";
import { GigCard } from "../../components/gigs/GigCard";

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
            loading={isLoading}
            emptyMessage="No upcoming gigs yet."
          />

          <GigSection
            title="PAST GIGS"
            gigs={pastGigs}
            loading={isLoading}
            emptyMessage="No past gigs yet."
          />
        </>
      }
    />
  );
}