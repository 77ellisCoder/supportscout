import {
    Text,
    View,
} from "react-native";

import { router } from "expo-router";
import { useBands } from "../../hooks/useBands";
import { useVenues } from "../../hooks/useVenues";
import { styles } from "../../styles/index.styles"
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
        isLoading,
        error,
    } = useBands();

    const bandCount = bands.length;

    const {
        data: venues = [],
    } = useVenues();

    const venueCount = venues.length;

    return (
        <View style={styles.statsGrid}>
            <StatCard
                label="BANDS"
                value={bandCount}
                caption="in your database"
                loading={isLoading}
                highlighted
                onPress={() => router.push("/bands")}
            />

            <StatCard
                label="VENUES"
                value={venueCount}
                caption="in your database"
                loading={isLoading}
                highlighted
                onPress={() => router.push("/venues")}
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