import { Link, router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useBands } from "../hooks/useBands";
import { styles } from "../styles/index.styles"
import { Button } from "../components/Button";
import { StatCard } from "../components/StatCard";
import { NavigationCard } from "../components/NavigationCard";

export default function HomeScreen() {
  const {
    data: bands = [],
    isLoading,
    error,
  } = useBands();

  const bandCount = bands.length;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
    >
      {/* Hero */}
      <View style={styles.hero}>

        <Image
          source={require("../assets/branding/logo-horizontal.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Intro */}

      <View style={styles.intro}>
        <Text style={styles.eyebrow}>Built for Perth's Live Music Scene</Text>

        <Text style={styles.heading}>
          Build better shows.
        </Text>

        <Text style={styles.introText}>
          Discover compatible artists, research the local scene and build stronger live lineups.
        </Text>



      </View>

      {/* Stats */}

      <View style={styles.statsGrid}>
        <StatCard
          label="BANDS"
          value={bandCount}
          caption="in your database"
          loading={isLoading}
          highlighted
        />

        <StatCard
          label="VENUES"
          value="—"
          caption="coming next"
        />

        <StatCard
          label="LINEUPS"
          value="—"
          caption="ready to build"
        />
      </View>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorTitle}>
            Couldn't load dashboard data
          </Text>

          <Text style={styles.errorText}>
            {error instanceof Error
              ? error.message
              : String(error)}
          </Text>
        </View>
      )}

      {/* Primary Action */}

      <View style={styles.exploreWrapper}>
        <Button
          title="Start Scouting"
          sound={true}
          onPress={() => router.push("/bands")}
          iconRight={
            <Text style={styles.exploreArrow}>
              →
            </Text>
          }
        />
      </View>

      {/* Section heading */}

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionEyebrow}>
            WORKSPACE
          </Text>

          <Text style={styles.sectionTitle}>
            Scout. Plan. Book.
          </Text>
        </View>
      </View>

      {/* Navigation */}

      <View style={styles.navigationGrid}>
        <NavigationCard
          href="/bands"
          icon="♪"
          title="Bands"
          description="Research artists and support options"
        />

        <NavigationCard
          href="/rankings"
          icon="★"
          title="Rankings"
          description="Compare compatibility and potential"
        />

        <NavigationCard
          href="/lineups"
          icon="≡"
          title="Lineup Builder"
          description="Build and compare show lineups"
        />

        <NavigationCard
          href="/events"
          icon="◈"
          title="Events"
          description="Plan upcoming shows and gigs"
        />

        <NavigationCard
          href="/venues"
          icon="⌂"
          title="Venues"
          description="Research Perth live music venues"
        />

        <NavigationCard
          href="/contacts"
          icon="@"
          title="Contacts"
          description="Manage artists and booking relationships"
        />
      </View>

      {/* Coming Soon */}

      <View style={styles.intelligenceCard}>
        <View style={styles.intelligenceBadge}>
          <Text style={styles.intelligenceBadgeText}>
            SUPPORTSCOUT INTELLIGENCE
          </Text>
        </View>

        <Text style={styles.intelligenceTitle}>
          Your lineup assistant is coming.
        </Text>

        <Text style={styles.intelligenceText}>
          SupportScout will use genre fit, audience crossover,
          live history and local momentum to recommend the
          strongest acts for each show.
        </Text>

        <View style={styles.intelligenceFeatures}>
          <Text style={styles.feature}>✦ Compatibility scoring</Text>
          <Text style={styles.feature}>✦ Audience insights</Text>
          <Text style={styles.feature}>✦ Lineup recommendations</Text>
        </View>
      </View>

      {/* Footer */}

      <View style={styles.footer}>
        <View style={styles.footerLine} />

        <Text style={styles.footerText}>
          FIND THE RIGHT SUPPORT
        </Text>

        <Text style={styles.footerStar}>✦</Text>

        <Text style={styles.footerText}>
          BUILD BETTER LINEUPS
        </Text>

        <View style={styles.footerLine} />
      </View>
    </ScrollView>
  );
}