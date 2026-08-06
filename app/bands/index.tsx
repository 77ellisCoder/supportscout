import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

const bands = [
  { id: 1, name: "Red Temples", score: 100 },
  { id: 2, name: "Example Perth Band", score: 82 },
];

export default function BandsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bands</Text>
      <FlatList
        data={bands}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link href={`/bands/${item.id}`} style={styles.row}>
            {item.name} — {item.score}
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  row: { paddingVertical: 14, borderBottomWidth: 1, fontSize: 17 },
});
