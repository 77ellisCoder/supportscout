import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { styles } from "./BandCard.styles";

type BandCardProps = {
  id: number;
  name: string;
  description?: string | null;
  hometown?: string | null;
  memberCount?: number | null;
  score?: number | null;
};

export function BandCard({
  id,
  name,
  description,
  hometown,
  memberCount,
  score,
}: BandCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${name}`}
      onPress={() => router.push(`/bands/${id}`)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.headingRow}>
          <Text style={styles.name}>
            {name}
          </Text>

          {score != null && (
            <View style={styles.scoreBadge}>
              <Text style={styles.score}>
                {score}
              </Text>
            </View>
          )}
        </View>

        {description && (
          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {hometown || "Perth"}
          </Text>

          {memberCount != null && (
            <>
              <Text style={styles.metaDot}>•</Text>

              <Text style={styles.meta}>
                {memberCount}{" "}
                {memberCount === 1 ? "member" : "members"}
              </Text>
            </>
          )}
        </View>
      </View>

      <Text style={styles.chevron}>
        ›
      </Text>
    </Pressable>
  );
}