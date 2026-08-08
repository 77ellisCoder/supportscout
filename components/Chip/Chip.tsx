import { Pressable, Text } from "react-native";

import { styles } from "./Chip.styles";

type ChipProps = {
    label: string;
    selected?: boolean;
    onPress?: () => void;
};

export function Chip({
    label,
    selected = false,
    onPress,
}: ChipProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={onPress}
            style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && styles.chipPressed,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    selected && styles.textSelected,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}