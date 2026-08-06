import { StyleSheet, Text, View } from "react-native";

export default function RankingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rankings</Text>
      <Text>Rankings content goes here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
});
