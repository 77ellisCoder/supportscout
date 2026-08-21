import { router } from "expo-router";
import { View } from "react-native";

import { MenuItem } from "./MenuItem";
import { styles } from "./AppMenu.styles";

type AppMenuProps = {
    onClose: () => void;
};

export function AppMenu({ onClose }: AppMenuProps) {
    const goTo = (
        path:
            | "/"
            | "/bands"
            | "/venues"
            | "/gigs"
    ) => {
        onClose();
        router.push(path);
    };

    return (
        <View style={styles.menu}>
            <MenuItem
                title="Home"
                description="SupportScout dashboard"
                onPress={() => goTo("/")}
            />

            <MenuItem
                title="Bands"
                description="Search and explore artists"
                onPress={() => goTo("/bands")}
            />

            <MenuItem
                title="Rankings"
                description="Compare lineup compatibility"
                disabled
            />

            <MenuItem
                title="Venues"
                description="Research Perth venues"
                onPress={() => goTo("/venues")}
            />

            <MenuItem
                title="Lineups"
                description="Build and save show lineups"
                disabled
            />

            <MenuItem
                title="Gigs"
                description="Track upcoming and past shows"
                onPress={() => goTo("/gigs")}
            />
        </View>
    );
}