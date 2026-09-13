import {
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  useAuth,
} from "../../hooks/useAuth";

import AvailabilityPreferencesCard from "../../components/settings/AvailabilityPreferencesCard";

import {
  styles,
} from "../../styles/settings.styles";

export default function SettingsScreen() {
  const {
    user,
  } = useAuth();

  if (!user) {
    return null;
  }
  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
    >
      <View
        style={
          styles.header
        }
      >
        <Text
          style={
            styles.title
          }
        >
          Settings
        </Text>

        <Text
          style={
            styles.subtitle
          }
        >
          Manage your SupportScout preferences.
        </Text>
      </View>

      <AvailabilityPreferencesCard
        userId={user.userId}
      />
    </ScrollView>
  );
}