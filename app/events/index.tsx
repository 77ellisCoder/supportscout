import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function EventsScreen() {
  return <View style={styles.container}><Text style={styles.title}>Events</Text><Link href="/events/1">Open sample event</Link></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, gap: 16 }, title: { fontSize: 28, fontWeight: "700" } });
