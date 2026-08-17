import { useState } from "react";
import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "../../styles/index.styles"
import { headerStyles } from "../../styles/header.styles"
import { AppMenu } from "../navigation/AppMenu";

/**
 * Header is the main header screen for the app, providing a centralized location for managing scouting, planning, and booking activities.
 * @component
 * @example
 * return (
 *   <Header />
 * )
 * @returns 
 */
export default function AppHeader() {
    const insets = useSafeAreaInsets();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <View style={[styles.appHeader, { paddingTop: insets.top }]}>
                <Pressable
                    onPress={() => setMenuOpen((current) => !current)}
                    style={styles.menuButton}
                    accessibilityRole="button"
                    accessibilityLabel={menuOpen ? "Close menu" : "Open menu"}
                >
                    {menuOpen ? (
                        <Text style={headerStyles.closeIcon}>×</Text>
                    ) : (
                        <Image
                            source={require("../../assets/branding/logo-icon.png")}
                            style={headerStyles.logoIcon}
                            resizeMode="contain"
                        />
                    )}
                </Pressable>

                <View style={headerStyles.brand}>
                    <Text style={headerStyles.brandName}>
                        Support<Text style={headerStyles.brandAccent}>Scout</Text>
                    </Text>

                    <Text style={headerStyles.tagline}>
                        FIND THE RIGHT SUPPORT. BUILD BETTER LINEUPS.
                    </Text>
                </View>

                <View style={headerStyles.headerSpacer} />
            </View>

            {menuOpen && (
                <AppMenu
                    onClose={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}