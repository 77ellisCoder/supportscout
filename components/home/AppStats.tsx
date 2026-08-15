import {
    Text,
    View,
} from "react-native";

import { useBands } from "../../hooks/useBands";
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
export default function AppStats() {
    const {
        data: bands = [],
        isLoading,
        error,
    } = useBands();

    const bandCount = bands.length;

    return (
        <View style={styles.statsGrid}>
            <StatCard
                label="BANDS"
                value={bandCount}
                caption="in your database"
                loading={isLoading}
                highlighted
            />

            <StatCard
                label="VENUES"
                value="—"
                caption="coming next"
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