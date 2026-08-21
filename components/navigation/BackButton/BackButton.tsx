import { router } from "expo-router";
import { Pressable, Text } from "react-native";

import { buttonStyles } from "../../../styles/shared/button.styles";

type BackButtonProps = {
    label?: string;
    fallbackRoute?: "/" | "/bands" | "/venues" | "/gigs";
    onPress?: () => void;
};

export function BackButton({
    label = "Back",
    fallbackRoute = "/",
    onPress,
}: BackButtonProps) {
    const handlePress = () => {
        if (onPress) {
            onPress();
            return;
        }

        if (router.canGoBack()) {
            router.back();
            return;
        }

        router.replace(fallbackRoute);
    };

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={handlePress}
            style={({ pressed }) => [
                buttonStyles.backButton,
                pressed && buttonStyles.backButtonPressed,
            ]}
        >
            <Text style={buttonStyles.backButtonText}>
                ‹ {label}
            </Text>
        </Pressable>
    );
}