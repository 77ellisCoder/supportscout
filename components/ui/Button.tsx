import type { ReactNode } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleProp,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";

import { SoundService } from "../../services/SoundService";
import { colors } from "../../theme";
import { styles } from "./Button.styles";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "ghost"
    | "danger"
    | "add";

type ButtonProps = {
    title: string;

    sound?: boolean;

    onPress?: () => void;

    variant?: ButtonVariant;

    disabled?: boolean;

    loading?: boolean;

    fullWidth?: boolean;

    iconLeft?: ReactNode;

    iconRight?: ReactNode;

    style?: StyleProp<ViewStyle>;

    textStyle?: StyleProp<TextStyle>;
};

export function Button({
    title,
    sound = false,
    onPress,
    variant = "primary",
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    style,
    textStyle,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const handlePress = () => {
        if (sound) {
            SoundService.click();
        }

        onPress?.();
    };

    const indicatorColor =
        variant === "primary" ||
            variant === "danger"
            ? colors.white
            : colors.primaryLight;

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

                pressed &&
                !isDisabled &&
                variant === "add" &&
                styles.addPressed,

                isDisabled &&
                styles.disabled,

                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={indicatorColor}
                />
            ) : (
                <View style={styles.content}>
                    {iconLeft}

                    <Text
                        style={[
                            styles.text,

                            variant === "primary" &&
                            styles.primaryText,

                            variant === "secondary" &&
                            styles.secondaryText,

                            variant === "ghost" &&
                            styles.secondaryText,

                            variant === "danger" &&
                            styles.dangerText,

                            variant === "add" &&
                            styles.addText,
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