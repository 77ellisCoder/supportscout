import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditVenueScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [name, setName] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id ? "Edit Venue" : "Add Venue"}</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Venue name" style={styles.input} />
      <Button title="Save" onPress={() => console.log({ id, name })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
});
