import "../styles/theme.css";

import { useEffect } from "react";
import { SoundService } from "../services/SoundService";
import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    SoundService.initialise();

    return () => {
      SoundService.unload();
    };
  }, []);

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
      </Stack>
    </QueryClientProvider>
  );
}