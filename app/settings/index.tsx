import {
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  router,
} from "expo-router";
import { useQuery } from "@tanstack/react-query";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  Button,
} from "../../components/ui/Button";

import AvailabilityPreferencesCard from "../../components/settings/AvailabilityPreferencesCard";

import MyBandsCard from "../../components/settings/MyBandsCard";
import CalendarConnectionsCard from "../../components/settings/CalendarConnectionsCard";
import { AdminService } from "../../services/admin/AdminService";

import {
  styles,
} from "../../styles/settings.styles";

export default function SettingsScreen() {
  const {
    user,
    logout,
  } = useAuth();

  const adminAccess = useQuery({
    queryKey: ["admin", "me"],
    queryFn: AdminService.getAccess,
    enabled: Boolean(user),
  });

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
          style={
            styles.compactButton
          }
          textStyle={
            styles.compactButtonText
          }
          onPress={
            handleLogout
          }
        />
      </View>

      <View
        style={
          styles.settingsCard
        }
      >
        <View
          style={
            styles.settingsDetails
          }
        >
          <Text
            style={
              styles.sectionLabel
            }
          >
            ACCOUNT SECURITY
          </Text>

          <Text
            style={
              styles.settingsTitle
            }
          >
            Password
          </Text>

          <Text
            style={
              styles.settingsDescription
            }
          >
            Set or change your SupportScout
            password.
          </Text>
        </View>

        <Button
          title="Manage password"
          variant="secondary"
          style={
            styles.compactButton
          }
          textStyle={
            styles.compactButtonText
          }
          onPress={() =>
            router.push(
              "/settings/security"
            )
          }
        />
      </View>

      {(adminAccess.data?.systemAdmin ||
        (adminAccess.data?.bandAdminIds.length ?? 0) > 0) && (
        <View style={styles.settingsCard}>
          <View style={styles.settingsDetails}>
            <Text style={styles.sectionLabel}>ADMINISTRATION</Text>
            <Text style={styles.settingsTitle}>Access and band members</Text>
            <Text style={styles.settingsDescription}>
              Manage system roles and the bands you administer.
            </Text>
          </View>
          <Button
            title="Manage access"
            variant="secondary"
            style={styles.compactButton}
            textStyle={styles.compactButtonText}
            onPress={() => router.push("/settings/admin")}
          />
        </View>
      )}

      <MyBandsCard />

      <CalendarConnectionsCard />

      <AvailabilityPreferencesCard
        userId={
          user.userId
        }
      />
    </ScrollView>
  );
}