import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { entityCardStyles as shared } from "../../styles/shared/EntityCard";
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
        shared.card,
        pressed && shared.cardPressed,
      ]}
    >
      <View style={shared.content}>
        <View style={shared.headingRow}>
          <Text style={shared.name}>
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
            style={shared.description}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        <View style={shared.metaRow}>
          <Text style={shared.meta}>
            {hometown || "Perth"}
          </Text>

          {memberCount != null && (
            <>
              <Text style={shared.metaDot}>•</Text>

              <Text style={shared.meta}>
                {memberCount}{" "}
                {memberCount === 1 ? "member" : "members"}
              </Text>
            </>
          )}
        </View>
      </View>

      <Text style={shared.chevron}>
        ›
      </Text>
    </Pressable>
  );
}