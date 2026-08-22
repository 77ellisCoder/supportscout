import { ActivityIndicator, Text, View } from "react-native";

import type { GigListItem } from "../../models/Gig";
import { colors } from "../../theme";
import { detailStyles } from "../../styles/shared/details.styles";

import { GigCard } from "./GigCard";
import { styles } from "./GigSection.styles";

type GigSectionProps = {
    title: string;
    gigs: GigListItem[];
    loading: boolean;
    emptyMessage: string;
};

export function GigSection({
    title,
    gigs,
    loading,
    emptyMessage,
}: GigSectionProps) {
    return (
        <View style={detailStyles.section}>
            <Text style={detailStyles.sectionLabel}>
                {title}
            </Text>

            {loading ? (
                <ActivityIndicator
                    color={colors.primaryLight}
                />
            ) : gigs.length === 0 ? (
                <Text style={detailStyles.bodyText}>
                    {emptyMessage}
                </Text>
            ) : (
                <View style={styles.list}>
                    {gigs.map((gig) => (
                        <GigCard
                            key={gig.gigId}
                            gig={gig}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}