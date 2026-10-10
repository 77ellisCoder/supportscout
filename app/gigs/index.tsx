import { router } from "expo-router";
import { useMemo } from "react";

import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";

import { GigSection } from "../../components/gigs/GigSection";

import { useGigs } from "../../hooks/useGigs";
import { colors } from "../../theme";
import { styles } from "../../styles/gigs.styles";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { parseDateValue } from "../../utils/date";

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
        const date = parseDateValue(gig.gigDate);

        return date ? date >= today : false;
      })
      .sort((a, b) => {
        const aTime = parseDateValue(a.gigDate)?.getTime() ?? Number.POSITIVE_INFINITY;
        const bTime = parseDateValue(b.gigDate)?.getTime() ?? Number.POSITIVE_INFINITY;

        return aTime - bTime;
      });
  }, [gigs]);

  const pastGigs = useMemo(() => {
    return gigs
      .filter((gig) => {
        const date = parseDateValue(gig.gigDate);

        return date ? date < today : false;
      })
      .sort((a, b) => {
        const aTime = parseDateValue(a.gigDate)?.getTime() ?? Number.NEGATIVE_INFINITY;
        const bTime = parseDateValue(b.gigDate)?.getTime() ?? Number.NEGATIVE_INFINITY;

        return bTime - aTime;
      });
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
          <PageHeader
            eyebrow="GIGS"
            title="Plan the next show."
            subtitle="Track upcoming and past gigs across SupportScout."
            action={
              <Button
                title="+ Add Gig"
                variant="add"
                onPress={() =>
                  router.push("/gigs/create")
                }
              />
            }
          />

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