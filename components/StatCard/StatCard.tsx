import {
    ActivityIndicator,
    Pressable,
    StyleProp,
    Text,
    View,
    ViewStyle,
} from "react-native";

import { colors } from "../../theme";
import { styles } from "./StatCard.styles";

type StatCardProps = {
    label: string;
    value: string | number;
    caption?: string;
    loading?: boolean;
    highlighted?: boolean;
    onPress?: () => void;
    valueVariant?: "stat" | "name";
    style?: StyleProp<ViewStyle>;
};

export function StatCard({
    label,
    value,
    caption,
    loading = false,
    highlighted = false,
    onPress,
    valueVariant = "stat",
    style,
}: StatCardProps) {
    return (
        <Pressable
            disabled={!onPress}
            onPress={onPress}
            accessibilityRole={onPress ? "button" : undefined}
            style={({ pressed }) => [
                styles.card,
                pressed && onPress && styles.cardPressed,
                style,
            ]}
        >
            <Text style={styles.label}>
                {label}
            </Text>

            {loading ? (
                <View style={styles.valueContainer}>
                    <ActivityIndicator
                        size="small"
                        color={colors.primaryLight}
                    />
                </View>
            ) : (
                <Text
                    style={[
                        styles.value,
                        valueVariant === "name" &&
                        styles.valueName,
                        highlighted
                            ? styles.valueHighlighted
                            : styles.valueMuted,
                    ]}
                >
                    {value}
                </Text>
            )}

            {caption && (
                <Text style={styles.caption}>
                    {caption}
                </Text>
            )}
        </Pressable>
    );
}