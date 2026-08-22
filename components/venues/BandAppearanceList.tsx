import { router } from "expo-router";
import {
  Pressable,
  Text,
  View,
} from "react-native";

import type { VenueBand } from "../../models/VenueBand";
import { styles } from "./BandAppearanceList.styles";

type BandAppearanceListProps = {
  bands: VenueBand[];
};

export function BandAppearanceList({
  bands,
}: BandAppearanceListProps) {
  return (
    <View style={styles.list}>
      {bands.map((band) => (
        <Pressable
          key={band.bandId}
          onPress={() =>
            router.push(
              `/bands/${band.bandId}`
            )
          }
          style={({ pressed }) => [
            styles.row,
            pressed && styles.rowPressed,
          ]}
        >
          <View style={styles.content}>
            <Text style={styles.name}>
              {band.bandName}
            </Text>

            {band.shortDescription && (
              <Text
                style={styles.description}
                numberOfLines={1}
              >
                {band.shortDescription}
              </Text>
            )}
          </View>

          <View style={styles.appearance}>
            <Text style={styles.count}>
              {band.gigCount}
            </Text>

            <Text style={styles.countLabel}>
              {band.gigCount === 1
                ? "gig"
                : "gigs"}
            </Text>
          </View>

          <Text style={styles.chevron}>
            ›
          </Text>
        </Pressable>
      ))}
    </View>
  );
}