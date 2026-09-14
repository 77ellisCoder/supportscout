import {
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  router,
} from "expo-router";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  Button,
} from "../../components/ui/Button";

import AvailabilityPreferencesCard from "../../components/settings/AvailabilityPreferencesCard";

import {
  styles,
} from "../../styles/settings.styles";

export default function SettingsScreen() {
  const {
    user,
    logout,
  } = useAuth();

  if (!user) {
    return null;
  }

  async function handleLogout() {
    await logout();

    router.replace(
      "/login"
    );
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

      <View
        style={
          styles.accountCard
        }
      >
        <View
          style={
            styles.accountDetails
          }
        >
          <Text
            style={
              styles.sectionLabel
            }
          >
            SIGNED IN AS
          </Text>

          <Text
            style={
              styles.accountName
            }
          >
            {user.displayName ??
              user.email}
          </Text>

          <Text
            style={
              styles.accountEmail
            }
          >
            {user.email}
          </Text>
        </View>

        <Button
          title="Sign out"
          variant="secondary"
          onPress={
            handleLogout
          }
        />
      </View>

      <AvailabilityPreferencesCard
        userId={
          user.userId
        }
      />
    </ScrollView>
  );
}