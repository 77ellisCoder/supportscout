import {
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import { useBands } from "../../hooks/useBands";
import { useGigs } from "../../hooks/useGigs";
import { useVenues } from "../../hooks/useVenues";
import { useMyBands } from "../../hooks/useUserBands";

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

    const {
        data: myBands = [],
        isLoading: myBandsLoading,
        error: myBandsError,
    } = useMyBands();

    const myBand =
        myBands.length === 1
            ? myBands[0]
            : null;

    const error =
        bandsError ??
        venuesError ??
        gigsError ??
        myBandsError;

    return (
        <View style={styles.statsSection}>
            <StatCard
                label={
                    myBands.length > 1
                        ? "MY BANDS"
                        : "MY BAND"
                }
                value={
                    myBand
                        ? myBand.bandName
                        : myBands.length > 1
                            ? myBands
                                .map((band) => band.bandName)
                                .join(" • ")
                            : "—"
                }
                valueVariant="name"
                caption={
                    myBand
                        ? "Band details"
                        : myBands.length > 1
                            ? "Manage bands"
                            : "Choose your band"
                }
                loading={myBandsLoading}
                highlighted
                style={styles.myBandCard}
                onPress={() => {
                    if (myBand) {
                        router.push(
                            `/bands/${myBand.bandId}`
                        );
                        return;
                    }

                    router.push(
                        "/settings/bands"
                    );
                }}
            />

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
                    style={styles.statsGridCard}
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
                    style={styles.statsGridCard}
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
                    style={styles.statsGridCard}
                />

                <StatCard
                    label="LINEUPS"
                    value="—"
                    caption="ready to build"
                    style={styles.statsGridCard}
                />
            </View>

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