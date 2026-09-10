import {
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import { useBands } from "../../hooks/useBands";
import { useGigs } from "../../hooks/useGigs";
import { useVenues } from "../../hooks/useVenues";

import { styles } from "../../styles/index.styles";
import { StatCard } from "../StatCard";

/**
 * Stats is the main header screen for the app, providing a centralized location for managing scouting, planning, and booking activities.
 * @component
 * @example
 * return (
 *   <Stats />
 * )
 * @returns 
 */
export default function StatsSection() {
    const {
        data: bands = [],
        isLoading: bandsLoading,
        error: bandsError,
    } = useBands();

    const {
        data: venues = [],
        isLoading: venuesLoading,
        error: venuesError,
    } = useVenues();

    const {
        data: gigs = [],
        isLoading: gigsLoading,
        error: gigsError,
    } = useGigs();

    const error =
        bandsError ??
        venuesError ??
        gigsError;

    return (
        <View style={styles.statsGrid}>
            <StatCard
                label="BANDS"
                value={bands.length}
                caption="in your database"
                loading={bandsLoading}
                highlighted
                onPress={() =>
                    router.push("/bands")
                }
            />

            <StatCard
                label="VENUES"
                value={venues.length}
                caption="in your database"
                loading={venuesLoading}
                highlighted
                onPress={() =>
                    router.push("/venues")
                }
            />

            <StatCard
                label="GIGS"
                value={gigs.length}
                caption="in your database"
                loading={gigsLoading}
                highlighted
                onPress={() =>
                    router.push("/gigs")
                }
            />

            <StatCard
                label="LINEUPS"
                value="—"
                caption="ready to build"
            />

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
        </View>
    );
}