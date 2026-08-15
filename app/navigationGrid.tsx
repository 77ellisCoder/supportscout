import {
    ScrollView,
    Text,
    View,
} from "react-native";

import { styles } from "../styles/index.styles"
import { NavigationCard } from "../components/NavigationCard";

/**
 * NavigationGridScreen is the main navigation screen for the app, providing quick access to key features and sections.
 *
 * @component
 * @example
 * return (
 *   <NavigationGridScreen />
 * )
 * @returns 
 */
export default function NavigationGridScreen() {
    return (
        <ScrollView
            style={styles.page}
            contentContainerStyle={styles.container}
        >
            {/* Navigation */}

            <View style={styles.navigationGrid}>
                <NavigationCard
                    href="/bands"
                    icon="♪"
                    title="Bands"
                    description="Research artists and support options"
                />

                <NavigationCard
                    href="/rankings"
                    icon="★"
                    title="Rankings"
                    description="Compare compatibility and potential"
                />

                <NavigationCard
                    href="/lineups"
                    icon="≡"
                    title="Lineup Builder"
                    description="Build and compare show lineups"
                />

                <NavigationCard
                    href="/events"
                    icon="◈"
                    title="Events"
                    description="Plan upcoming shows and gigs"
                />

                <NavigationCard
                    href="/venues"
                    icon="⌂"
                    title="Venues"
                    description="Research Perth live music venues"
                />

                <NavigationCard
                    href="/contacts"
                    icon="@"
                    title="Contacts"
                    description="Manage artists and booking relationships"
                />
            </View>

            {/* Coming Soon */}

            <View style={styles.intelligenceCard}>
                <View style={styles.intelligenceBadge}>
                    <Text style={styles.intelligenceBadgeText}>
                        SUPPORTSCOUT INTELLIGENCE
                    </Text>
                </View>

                <Text style={styles.intelligenceTitle}>
                    Your lineup assistant is coming.
                </Text>

                <Text style={styles.intelligenceText}>
                    SupportScout will use genre fit, audience crossover,
                    live history and local momentum to recommend the
                    strongest acts for each show.
                </Text>

                <View style={styles.intelligenceFeatures}>
                    <Text style={styles.feature}>✦ Compatibility scoring</Text>
                    <Text style={styles.feature}>✦ Audience insights</Text>
                    <Text style={styles.feature}>✦ Lineup recommendations</Text>
                </View>
            </View>
        </ScrollView>
    );
}