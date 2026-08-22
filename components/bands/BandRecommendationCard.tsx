import { router } from "expo-router";
import {
    Pressable,
    Text,
    View,
} from "react-native";

import type { BandRecommendation } from "../../models/BandRecommendation";
import { styles } from "./BandRecommendationCard.styles";

type BandRecommendationCardProps = {
    recommendation: BandRecommendation;
};

export function BandRecommendationCard({
    recommendation,
}: BandRecommendationCardProps) {
    const {
        bandId,
        bandName,
        shortDescription,
        sharedGigCount,
        sharedVenueCount,
        sharedGenreTerms,
        score,
    } = recommendation;

    return (
        <Pressable
            onPress={() =>
                router.push(`/bands/${bandId}`)
            }
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.content}>
                <Text style={styles.bandName}>
                    {bandName}
                </Text>

                {shortDescription && (
                    <Text
                        style={styles.description}
                        numberOfLines={1}
                    >
                        {shortDescription}
                    </Text>
                )}

                <View style={styles.reasons}>
                    {sharedGigCount > 0 && (
                        <Text style={styles.reason}>
                            {sharedGigCount}{" "}
                            {sharedGigCount === 1
                                ? "shared gig"
                                : "shared gigs"}
                        </Text>
                    )}

                    {sharedGigCount > 0 &&
                        sharedVenueCount > 0 && (
                            <Text style={styles.separator}>
                                •
                            </Text>
                        )}

                    {sharedVenueCount > 0 && (
                        <Text style={styles.reason}>
                            {sharedVenueCount}{" "}
                            {sharedVenueCount === 1
                                ? "shared venue"
                                : "shared venues"}
                        </Text>
                    )}

                </View>

                {sharedGenreTerms.length > 0 && (
                    <View style={styles.genreRow}>
                        <Text style={styles.genreLabel}>
                            Genre match:
                        </Text>

                        <Text style={styles.genreTerms}>
                            {sharedGenreTerms.join(", ")}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.scoreContainer}>
                <Text style={styles.score}>
                    {score}
                </Text>

                <Text style={styles.scoreLabel}>
                    MATCH
                </Text>
            </View>

            <Text style={styles.chevron}>
                ›
            </Text>
        </Pressable>
    );
}