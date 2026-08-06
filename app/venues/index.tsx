import { StyleSheet, Text, View } from "react-native";

export default function VenuesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Venues</Text>
      <Text>Venues content goes here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
});
