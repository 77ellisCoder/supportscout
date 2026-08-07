import "../styles/theme.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { importSupportBands } from "../database/sqlite/imports/SpreadsheetImporter";

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    importSupportBands()
      .then(() => {
        return queryClient.invalidateQueries({
          queryKey: ["bands"],
        });
      })
      .catch((error) => {
        console.error("Spreadsheet import failed:", error);
      });
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