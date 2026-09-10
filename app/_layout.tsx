import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Stack,
  router,
} from "expo-router";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppBootstrapService } from "../services/AppBootstrapService";
import { SoundService } from "../services/SoundService";
import { colors } from "../theme";

import { HeaderHomeButton } from "../components/ui/HeaderHomeButton";
import { HeaderTitle } from "../components/ui/HeaderTitle";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [startupError, setStartupError] =
    useState<string | null>(null);

  useEffect(() => {
    async function initialise() {
      try {
        await AppBootstrapService.initialise();
        await SoundService.initialise();

        setReady(true);
      } catch (error) {
        setStartupError(
          error instanceof Error
            ? error.message
            : String(error)
        );
      }
    }

    initialise();

    return () => {
      SoundService.unload();
    };
  }, []);

  if (startupError) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            SupportScout couldn't start
          </Text>

          <Text
            style={{
              color: colors.danger,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {startupError}
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!ready) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator
            color={colors.primaryLight}
          />

          <Text
            style={{
              color: colors.textSecondary,
              marginTop: 12,
            }}
          >
            Preparing SupportScout...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerLeft: () => (
              <HeaderHomeButton />
            ),

            headerStyle: {
              backgroundColor: colors.background,
            },

            headerTintColor: colors.text,

            headerShadowVisible: true,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          {/* Bands */}

          <Stack.Screen
            name="bands/index"
            options={{
              title: "Bands",
            }}
          />

          <Stack.Screen
            name="bands/[id]"
            options={{
              headerTitle:
                backTitle("Band Details"),
            }}
          />

          <Stack.Screen
            name="bands/create"
            options={{
              headerTitle:
                backTitle("Add Band"),
            }}
          />

          <Stack.Screen
            name="bands/edit"
            options={{
              headerTitle:
                backTitle("Edit Band"),
            }}
          />

          {/* Venues */}

          <Stack.Screen
            name="venues/index"
            options={{
              title: "Venues",
            }}
          />

          <Stack.Screen
            name="venues/[id]"
            options={{
              headerTitle:
                backTitle("Venue Details"),
            }}
          />

          <Stack.Screen
            name="venues/create"
            options={{
              headerTitle:
                backTitle("Add Venue"),
            }}
          />

          <Stack.Screen
            name="venues/edit"
            options={{
              headerTitle:
                backTitle("Edit Venue"),
            }}
          />

          {/* Gigs */}

          <Stack.Screen
            name="gigs/index"
            options={{
              title: "Gigs",
            }}
          />

          <Stack.Screen
            name="gigs/[id]"
            options={{
              headerTitle:
                backTitle("Gig Details"),
            }}
          />

          <Stack.Screen
            name="gigs/create"
            options={{
              headerTitle:
                backTitle("Add Gig"),
            }}
          />

          <Stack.Screen
            name="gigs/edit"
            options={{
              headerTitle:
                backTitle("Edit Gig"),
            }}
          />

          {/* Other */}

          <Stack.Screen
            name="genres/index"
            options={{
              title: "Genres",
            }}
          />

          <Stack.Screen
            name="pr/index"
            options={{
              title: "PR Contacts",
            }}
          />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function backTitle(title: string) {
  return () => (
    <HeaderTitle
      title={title}
      showBack
    />
  );
}