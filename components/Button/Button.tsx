import type { ReactNode } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from "react-native";
import { Audio } from "expo-av";
import { SoundService } from "../../services/SoundService";

import { colors } from "../../theme";
import { styles } from "./Button.styles";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
    title: string;
    sound?: boolean;
    onPress?: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
};

export function Button({
    title,
    sound = false,
    onPress,
    variant = "primary",
    disabled = false,
    loading = false,
    iconLeft,
    iconRight,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const handlePress = () => {
        if (sound) {
            SoundService.click();
        }

        onPress?.();
    };

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{
                disabled: isDisabled,
                busy: loading,
            }}
            disabled={isDisabled}
            onPress={handlePress}
            style={({ pressed }) => [
                styles.button,
                styles[variant],

                pressed &&
                !isDisabled &&
                styles.pressed,

                isDisabled &&
                styles.disabled,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={
                        variant === "primary"
                            ? colors.white
                            : colors.primaryLight
                    }
                />
            ) : (
                <View style={styles.content}>
                    {iconLeft}

                    <Text
                        style={[
                            styles.text,
                            variant === "primary"
                                ? styles.primaryText
                                : styles.secondaryText,
                        ]}
                    >
                        {title}
                    </Text>

                    {iconRight}
                </View>
            )}
        </Pressable>
    );
}