import {
  Pressable,
  Text,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  styles,
} from "../../styles/shared/header-settings-button.styles";

export function HeaderSettingsButton() {
  return (
    <Pressable
      onPress={() =>
        router.push(
          "/settings"
        )
      }
      accessibilityRole="button"
      accessibilityLabel="Settings"
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed &&
        styles.pressed,
      ]}
    >
      <Text
        style={
          styles.icon
        }
      >
        ⚙
      </Text>
    </Pressable>
  );
}