import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const sections = [
  ["/bands", "Bands"],
  ["/rankings", "Rankings"],
  ["/events", "Events"],
  ["/lineups", "Lineups"],
  ["/venues", "Venues"],
  ["/contacts", "Contacts"],
  ["/settings", "Settings"],
] as const;

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SupportScout</Text>
      <Text style={styles.subtitle}>Research, rank and build Perth band line-ups.</Text>
      <View style={styles.grid}>
        {sections.map(([href, label]) => (
          <Link key={href} href={href} style={styles.card}>{label}</Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { fontSize: 16 },
  grid: { gap: 12 },
  card: { padding: 18, borderWidth: 1, borderRadius: 12, fontSize: 18, fontWeight: "600" },
});
