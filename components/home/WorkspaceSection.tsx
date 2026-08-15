import {
    ScrollView,
    Text,
    View,
} from "react-native";

import { styles } from "../../styles/index.styles"

/**
 * WorkspaceSection is the main section for the workspace, providing a centralized location for managing scouting, planning, and booking activities.
 * @component
 * @example
 * return (
 *   <WorkspaceSection />
 * )
 * @returns 
 */
export default function WorkspaceSection() {
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