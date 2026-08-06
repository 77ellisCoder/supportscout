import { StyleSheet, Text, View } from "react-native";
export default function LineupBuilderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lineup Builder</Text>
      <Text>Headline</Text><Text>Main support</Text><Text>Support</Text><Text>Opening act</Text>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, gap: 16 }, title: { fontSize: 28, fontWeight: "700" } });
