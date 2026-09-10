import {
  Pressable,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import { styles } from "../../styles/shared/header-title.styles";

type HeaderTitleProps = {
  title: string;
  showBack?: boolean;
};

export function HeaderTitle({
  title,
  showBack = false,
}: HeaderTitleProps) {
  return (
    <View style={styles.container}>
      {showBack && (
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={({ pressed }) => [
            styles.backButton,
            pressed &&
              styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>
      )}

      <Text
        style={styles.title}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}