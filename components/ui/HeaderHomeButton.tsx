import {
  Image,
  Pressable,
} from "react-native";

import { router } from "expo-router";

import { styles } from "../../styles/shared/header-home-button.styles";

export function HeaderHomeButton() {
  return (
    <Pressable
      onPress={() =>
        router.replace("/")
      }
      accessibilityRole="button"
      accessibilityLabel="SupportScout home"
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={require(
          "../../assets/branding/logo-icon.png"
        )}
        style={styles.icon}
      />
    </Pressable>
  );
}