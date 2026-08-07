import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useBands } from "../hooks/useBands";

const colors = {
  background: "#0D0D14",
  backgroundDeep: "#08080D",
  surface: "#1A1A24",
  surfaceHover: "#22222E",
  border: "#2A2A36",

  purple: "#8E5BFF",
  purpleLight: "#B78CFF",

  text: "#F2F2F7",
  textSecondary: "#A7A7B3",
  textMuted: "#747482",
};

type NavigationCardProps = {
  href:
  | "/bands"
  | "/rankings"
  | "/events"
  | "/lineups"
  | "/venues"
  | "/contacts"
  | "/settings";
  icon: string;
  title: string;
  description: string;
};

function NavigationCard({
  href,
  icon,
  title,
  description,
}: NavigationCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.navigationCard,
          pressed && styles.navigationCardPressed,
        ]}
      >
        <View style={styles.navigationIcon}>
          <Text style={styles.navigationIconText}>{icon}</Text>
        </View>

        <View style={styles.navigationContent}>
          <Text style={styles.navigationTitle}>{title}</Text>
          <Text style={styles.navigationDescription}>
            {description}
          </Text>
        </View>

        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </Link>
  );
}

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
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>BANDS</Text>

          {isLoading ? (
            <ActivityIndicator color={colors.purpleLight} />
          ) : (
            <Text style={styles.statValue}>{bandCount}</Text>
          )}

          <Text style={styles.statCaption}>
            in your database
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>VENUES</Text>
          <Text style={styles.statValueMuted}>—</Text>
          <Text style={styles.statCaption}>coming next</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>LINEUPS</Text>
          <Text style={styles.statValueMuted}>—</Text>
          <Text style={styles.statCaption}>ready to build</Text>
        </View>
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

      <Link href="/bands" asChild>
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
            alignSelf: "center",
          })}
        >
          <View style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>
              Start Scouting
            </Text>

            <Text style={styles.exploreButtonArrow}>
              →
            </Text>
          </View>
        </Pressable>
      </Link>

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

const styles = StyleSheet.create({
  logo: {
    width: 560,
    height: 150,
    alignSelf: "center",
    marginBottom: 24,
  },

  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  exploreButton: {
    backgroundColor: "#8E5BFF",

    minWidth: 220,
    minHeight: 58,

    paddingHorizontal: 30,
    paddingVertical: 16,

    borderRadius: 999,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,

    shadowColor: "#8E5BFF",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    // especially helpful on web
    cursor: "pointer" as any,
  },

  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  exploreButtonArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  exploreButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },

  exploreTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },

  exploreSubtitle: {
    color: "rgba(255,255,255,.85)",
    marginTop: 4,
  },

  exploreArrow: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },

  container: {
    flex: 1,
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 64,
  },

  hero: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 52,
  },

  heroBackground: {
    position: "absolute",
    top: -180,
    right: -120,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "rgba(142,91,255,.08)",
  },

  brandIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#EFE9DD",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  brandSearch: {
    color: "#EFE9DD",
    fontSize: 0,
  },

  brandStage: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  spotlight: {
    position: "absolute",
    top: -3,
    width: 28,
    height: 34,
    backgroundColor: "rgba(142, 91, 255, 0.30)",
    transform: [{ perspective: 40 }, { rotateX: "8deg" }],
  },

  microphone: {
    width: 5,
    height: 27,
    borderRadius: 3,
    backgroundColor: colors.purple,
    marginBottom: 5,
  },

  brand: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -1,
  },

  brandAccent: {
    color: colors.purpleLight,
  },

  tagline: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.7,
  },

  intro: {
    maxWidth: 720,
    marginBottom: 36,
  },

  eyebrow: {
    color: colors.purpleLight,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },

  heading: {
    color: colors.text,
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -2,
    lineHeight: 54,
  },

  introText: {
    color: colors.textSecondary,
    fontSize: 18,
    lineHeight: 28,
    marginTop: 14,
    maxWidth: 800,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 18,
  },

  statCard: {
    minWidth: 180,
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 20,
  },

  statLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.6,
  },

  statValue: {
    color: colors.purpleLight,
    fontSize: 38,
    fontWeight: "700",
    marginTop: 8,
  },

  statValueMuted: {
    color: colors.textMuted,
    fontSize: 38,
    fontWeight: "700",
    marginTop: 8,
  },

  statCaption: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  errorCard: {
    borderWidth: 1,
    borderColor: "#6D333B",
    backgroundColor: "#27171A",
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
  },

  errorTitle: {
    color: "#F5B3BB",
    fontWeight: "700",
  },

  errorText: {
    color: "#CD8C94",
    marginTop: 4,
  },

  primaryAction: {
    backgroundColor: colors.purple,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 26,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: colors.purple,
    shadowOpacity: 0.24,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  primaryActionPressed: {
    opacity: 0.88,
  },

  primaryEyebrow: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.6,
  },

  primaryTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
    marginTop: 4,
  },

  primaryDescription: {
    color: "rgba(255,255,255,0.80)",
    marginTop: 5,
    fontSize: 14,
  },

  primaryArrow: {
    color: "#FFFFFF",
    fontSize: 34,
    marginLeft: 20,
  },

  sectionHeading: {
    marginBottom: 18,
  },

  sectionEyebrow: {
    color: colors.purpleLight,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.7,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "700",
    marginTop: 4,
  },

  navigationGrid: {
    gap: 12,
    marginBottom: 50,
  },

  navigationCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  navigationCardPressed: {
    backgroundColor: colors.surfaceHover,
  },

  navigationIcon: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(142,91,255,0.12)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  navigationIconText: {
    color: colors.purpleLight,
    fontSize: 22,
    fontWeight: "700",
  },

  navigationContent: {
    flex: 1,
  },

  navigationTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
  },

  navigationDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },

  chevron: {
    color: colors.textMuted,
    fontSize: 28,
    marginLeft: 14,
  },

  intelligenceCard: {
    borderWidth: 1,
    borderColor: "rgba(142,91,255,0.32)",
    backgroundColor: "#15131F",
    borderRadius: 22,
    padding: 26,
    marginBottom: 48,
  },

  intelligenceBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(142,91,255,0.12)",
    marginBottom: 16,
  },

  intelligenceBadgeText: {
    color: colors.purpleLight,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.3,
  },

  intelligenceTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "700",
  },

  intelligenceText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 700,
    marginTop: 10,
  },

  intelligenceFeatures: {
    marginTop: 20,
    gap: 7,
  },

  feature: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },

  footerLine: {
    flex: 1,
    maxWidth: 90,
    height: 1,
    backgroundColor: "rgba(142,91,255,0.35)",
  },

  footerText: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  footerStar: {
    color: colors.purple,
    fontSize: 12,
  },
});