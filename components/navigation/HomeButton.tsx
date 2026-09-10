import {
    Image,
    Pressable,
} from "react-native";
import { router } from "expo-router";

export function HomeButton() {
    return (
        <Pressable
            onPress={() =>
                router.replace("/")
            }
            accessibilityRole="button"
            accessibilityLabel="SupportScout home"
        >
            <Image
                source={require(
                    "../../assets/branding/logo-icon.png"
                )}
                style={{
                    width: 36,
                    height: 36,
                    resizeMode: "contain",
                }}
            />
        </Pressable>
    );
}