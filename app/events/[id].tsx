import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View style={styles.container}><Text style={styles.title}>Event Details</Text><Text>Event ID: {id}</Text></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, gap: 12 }, title: { fontSize: 28, fontWeight: "700" } });
