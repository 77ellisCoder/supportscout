import {
    ScrollView,
    Text,
    View,
} from "react-native";

import { styles } from "../styles/index.styles"

/**
 * WorkspaceScreen is the main screen for the workspace section, providing a centralized location for managing scouting, planning, and booking activities.
 * @component
 * @example
 * return (
 *   <WorkspaceScreen />
 * )
 * @returns 
 */
export default function WorkspaceScreen() {
    return (
        <ScrollView
            style={styles.page}
            contentContainerStyle={styles.container}
        >
            {/* Section heading */}

            <View style={styles.sectionHeading}>
                <View>
                    <Text style={styles.sectionEyebrow}>
                        WORKSPACE
                    </Text>

                    <Text style={styles.sectionTitle}>
                        Scout. Plan. Book.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}