import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { styles } from "./AppMenu.styles";

type AppMenuProps = {
    onClose: () => void;
};

export function AppMenu({ onClose }: AppMenuProps) {
    const navigate = (pathname: "/") => {
        onClose();
        router.push(pathname);
    };

    const navigateToBands = () => {
        onClose();
        router.push("/bands");
    };

    return (
        <View style={styles.menu}>
            <Pressable
                onPress={() => navigate("/")}
                style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                ]}
            >
                <View>
                    <Text style={styles.menuTitle}>Home</Text>
                    <Text style={styles.menuDescription}>
                        SupportScout dashboard
                    </Text>
                </View>

                <Text style={styles.chevron}>›</Text>
            </Pressable>

            <Pressable
                onPress={navigateToBands}
                style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                ]}
            >
                <View>
                    <Text style={styles.menuTitle}>Bands</Text>
                    <Text style={styles.menuDescription}>
                        Search and explore artists
                    </Text>
                </View>

                <Text style={styles.chevron}>›</Text>
            </Pressable>

            <View style={styles.menuItemDisabled}>
                <View>
                    <Text style={styles.menuTitle}>Rankings</Text>
                    <Text style={styles.menuDescription}>
                        Compare lineup compatibility
                    </Text>
                </View>

                <Text style={styles.comingSoon}>COMING SOON</Text>
            </View>

            <View style={styles.menuItemDisabled}>
                <View>
                    <Text style={styles.menuTitle}>Venues</Text>
                    <Text style={styles.menuDescription}>
                        Research Perth venues
                    </Text>
                </View>

                <Text style={styles.comingSoon}>COMING SOON</Text>
            </View>

            <View style={styles.menuItemDisabled}>
                <View>
                    <Text style={styles.menuTitle}>Lineups</Text>
                    <Text style={styles.menuDescription}>
                        Build and save show lineups
                    </Text>
                </View>

                <Text style={styles.comingSoon}>COMING SOON</Text>
            </View>
        </View>
    );
}