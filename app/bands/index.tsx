import { Link } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useBands } from "../../hooks/useBands";

export default function BandsScreen() {
  const {
    data: bands = [],
    status,
    fetchStatus,
    error,
    refetch,
  } = useBands();

  if (status === "pending") {
    return (
      <View style={styles.center}>
        <Text>Loading bands...</Text>
        <Text>Status: {status}</Text>
        <Text>Fetch status: {fetchStatus}</Text>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.center}>
        <Text>Unable to load bands.</Text>
        <Text>
          {error instanceof Error ? error.message : String(error)}
        </Text>
        <Text onPress={() => refetch()}>Try again</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bands</Text>

      <FlatList
        data={bands}
        keyExtractor={(item) => String(item.bandId)}
        renderItem={({ item }) => (
          <Link href={`/bands/${item.bandId}`} style={styles.row}>
            {item.bandName}
          </Link>
        )}
        ListEmptyComponent={<Text>No bands found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    fontSize: 17,
  },
  empty: {
    paddingVertical: 24,
    fontSize: 16,
  },
});