import { Pressable, Text, View } from "react-native";

import { styles } from "./AppMenu.styles";

type MenuItemProps = {
    title: string;
    description: string;
    disabled?: boolean;
    onPress?: () => void;
};

export function MenuItem({
    title,
    description,
    disabled = false,
    onPress,
}: MenuItemProps) {
    if (disabled) {
        return (
            <View style={styles.menuItemDisabled}>
                <View>
                    <Text style={styles.menuTitle}>
                        {title}
                    </Text>

                    <Text style={styles.menuDescription}>
                        {description}
                    </Text>
                </View>

                <Text style={styles.comingSoon}>
                    COMING SOON
                </Text>
            </View>
        );
    }

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
            ]}
        >
            <View>
                <Text style={styles.menuTitle}>
                    {title}
                </Text>

                <Text style={styles.menuDescription}>
                    {description}
                </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
        </Pressable>
    );
}