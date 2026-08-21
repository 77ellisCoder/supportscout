import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { useGigDetail } from "../../hooks/useGigDetail";
import { colors } from "../../theme";
import { styles } from "../../styles/gig-details.styles";

export default function GigDetailsScreen() {
    const { id } =
        useLocalSearchParams<{ id: string }>();

    const gigId = Number(id);

    const {
        data: gig,
        isLoading,
        error,
    } = useGigDetail(gigId);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    color={colors.primaryLight}
                />

                <Text style={styles.loadingText}>
                    Loading gig...
                </Text>
            </View>
        );
    }

    if (error || !gig) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorTitle}>
                    Unable to load gig
                </Text>

                <Text style={styles.errorText}>
                    Gig not found.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.page}
            contentContainerStyle={styles.container}
        >
            <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed,
                ]}
            >
                <Text style={styles.backButtonText}>
                    ‹ Back to Gigs
                </Text>
            </Pressable>

            <View style={styles.hero}>
                <Text style={styles.eyebrow}>
                    GIG PROFILE
                </Text>

                <Text style={styles.date}>
                    {formatGigDate(gig.gigDate)}
                </Text>

                <Text style={styles.title}>
                    {gig.eventName || "Untitled Gig"}
                </Text>

                <View style={styles.metaRow}>
                    <Text style={styles.meta}>
                        {gig.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                    VENUE
                </Text>

                {gig.venueId && gig.venueName ? (
                    <Pressable
                        onPress={() =>
                            router.push(
                                `/venues/${gig.venueId}`
                            )
                        }
                    >
                        <Text style={styles.linkTitle}>
                            {gig.venueName}
                        </Text>

                        {gig.suburb && (
                            <Text style={styles.bodyText}>
                                {gig.suburb}
                            </Text>
                        )}
                    </Pressable>
                ) : (
                    <Text style={styles.bodyText}>
                        No venue assigned
                    </Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                    LINEUP
                </Text>

                {gig.bands.length === 0 ? (
                    <Text style={styles.bodyText}>
                        No bands assigned
                    </Text>
                ) : (
                    <View style={styles.lineup}>
                        {gig.bands.map((band, index) => (
                            <Pressable
                                key={band.bandId}
                                onPress={() =>
                                    router.push(
                                        `/bands/${band.bandId}`
                                    )
                                }
                                style={({ pressed }) => [
                                    styles.lineupRow,
                                    pressed &&
                                    styles.lineupRowPressed,
                                ]}
                            >
                                <View style={styles.billingOrder}>
                                    <Text style={styles.billingOrderText}>
                                        {band.billingOrder ??
                                            index + 1}
                                    </Text>
                                </View>

                                <View style={styles.lineupContent}>
                                    <Text style={styles.linkTitle}>
                                        {band.bandName}
                                    </Text>

                                    {band.role && (
                                        <Text style={styles.bandRole}>
                                            {band.role}
                                        </Text>
                                    )}
                                </View>

                                <Text style={styles.chevron}>
                                    ›
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            {gig.notes && (
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>
                        NOTES
                    </Text>

                    <Text style={styles.bodyText}>
                        {gig.notes}
                    </Text>
                </View>
            )}

            <View style={styles.actions}>
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: "/gigs/edit",
                            params: { id: gig.gigId },
                        })
                    }
                    style={({ pressed }) => [
                        styles.editButton,
                        pressed && styles.editButtonPressed,
                    ]}
                >
                    <Text style={styles.editButtonText}>
                        Edit Gig
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

function formatGigDate(
    value: string
): string {
    const date = new Date(value);

    return date.toLocaleDateString("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}