import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function LineupsScreen() {
  return <View style={styles.container}><Text style={styles.title}>Lineups</Text><Link href="/lineups/builder">Create a lineup</Link></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, gap: 16 }, title: { fontSize: 28, fontWeight: "700" } });
