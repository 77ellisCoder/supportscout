import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { entityCardStyles as shared } from "../../styles/shared/EntityCard";
import { styles } from "./VenueCard.styles";

type VenueCardProps = {
  id: number;
  name: string;
  suburb?: string | null;
  venueType?: string | null;
  description?: string | null;
  capacity?: number | null;
};

export function VenueCard({
  id,
  name,
  suburb,
  venueType,
  description,
  capacity,
}: VenueCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${name}`}
      onPress={() => router.push(`/venues/${id}`)}
      style={({ pressed }) => [
        shared.card,
        pressed && shared.cardPressed,
      ]}
    >
      <View style={shared.content}>
        <View style={shared.headingRow}>
          <Text style={styles.name}>
            {name}
          </Text>
        </View>

        {description && (
          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        <View style={shared.metaRow}>
          <Text style={shared.meta}>
            {suburb || "Perth"}
          </Text>

          {venueType && (
            <>
              <Text style={shared.metaDot}>•</Text>

              <Text style={shared.meta}>
                {formatVenueType(venueType)}
              </Text>
            </>
          )}

          {capacity != null && (
            <>
              <Text style={shared.metaDot}>•</Text>

              <Text style={shared.meta}>
                {capacity} capacity
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

function formatVenueType(value: string): string {
  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}