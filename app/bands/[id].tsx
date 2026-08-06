import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function BandDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Band Details</Text>
      <Text>Band ID: {id}</Text>
      <Link href={{ pathname: "/bands/edit", params: { id } }} style={styles.link}>Edit band</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: "700" },
  link: { marginTop: 16, fontSize: 17, textDecorationLine: "underline" },
});
