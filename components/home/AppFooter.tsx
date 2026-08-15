import {
    Text,
    View,
} from "react-native";

import { styles } from "../../styles/index.styles"

/**
 * Footer is the main header screen for the app, providing a centralized location for managing scouting, planning, and booking activities.
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 * @returns 
 */
export default function AppFooter() {
    return (
        <View style={styles.footer}>
            <View style={styles.footerLine} />

            <Text style={styles.footerText}>
                FIND THE RIGHT SUPPORT
            </Text>

            <Text style={styles.footerStar}>✦</Text>

            <Text style={styles.footerText}>
                BUILD BETTER LINEUPS
            </Text>

            <View style={styles.footerLine} />
        </View>
    );
}