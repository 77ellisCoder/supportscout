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

import { useGig } from "../../hooks/useGig";
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
    } = useGig(gigId);

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

                <Text style={styles.bodyText}>
                    {gig.venueId != null
                        ? `Venue ID: ${gig.venueId}`
                        : "No venue assigned"}
                </Text>
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