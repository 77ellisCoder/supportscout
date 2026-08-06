import { StyleSheet, Text, View } from "react-native";
export function BandCard({ name, score }: { name: string; score?: number }) {
  return <View style={styles.card}><Text style={styles.name}>{name}</Text>{score !== undefined && <Text>Score: {score}</Text>}</View>;
}
const styles = StyleSheet.create({ card: { padding: 16, borderWidth: 1, borderRadius: 12, gap: 6 }, name: { fontSize: 18, fontWeight: "600" } });
