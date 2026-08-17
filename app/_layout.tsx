import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";
import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { AppBootstrapService } from "../services/AppBootstrapService";
import { SoundService } from "../services/SoundService";
import { colors } from "../theme";

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
    );
  }

  if (!ready) {
    return (
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
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="bands/index"
          options={{
            title: "Bands",
          }}
        />

        <Stack.Screen
          name="bands/[id]"
          options={{
            title: "Band Details",
          }}
        />

        <Stack.Screen
          name="venues/index"
          options={{
            title: "Venues",
          }}
        />

        <Stack.Screen
          name="venues/[id]"
          options={{
            title: "Venue Details",
          }}
        />

        <Stack.Screen
          name="venues/create"
          options={{
            title: "Add Venue",
          }}
        />

        <Stack.Screen
          name="venues/edit"
          options={{
            title: "Edit Venue",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}