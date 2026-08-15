import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import { styles } from "../styles/index.styles"

/**
 * Header is the main header screen for the app, providing a centralized location for managing scouting, planning, and booking activities.
 * @component
 * @example
 * return (
 *   <Header />
 * )
 * @returns 
 */
export default function Header() {
    return (
        <View style={styles.appHeader}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                onPress={() => {
                    console.log("Open menu");
                    // we'll wire the real menu/drawer next
                }}
                style={({ pressed }) => [
                    styles.menuButton,
                    pressed && styles.menuButtonPressed,
                ]}
            >
                <Image
                    source={require("../assets/branding/logo-icon.png")}
                    style={styles.menuIcon}
                    resizeMode="contain"
                />
            </Pressable>

            <View style={styles.brandBlock}>
                <Text style={styles.brandName}>
                    Support<Text style={styles.brandAccent}>Scout</Text>
                </Text>

                <Text style={styles.brandTagline}>
                    FIND THE RIGHT SUPPORT. BUILD BETTER LINEUPS.
                </Text>
            </View>

            {/* balances the left menu button so the brand stays centered */}
            <View style={styles.headerSpacer} />
        </View>
    );
}