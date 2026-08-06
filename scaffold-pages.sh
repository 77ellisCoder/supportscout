#!/usr/bin/env bash
set -euo pipefail

FORCE=false
[[ "${1:-}" == "--force" ]] && FORCE=true
ROOT="$(pwd)"

write_file() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  if [[ -f "$path" && "$FORCE" != true ]]; then
    echo "Skipping existing: ${path#$ROOT/}"
    return
  fi
  cat > "$path"
  echo "Created: ${path#$ROOT/}"
}

mkdir -p app/{bands,events,lineups,rankings,venues,contacts,settings} \
  components services database hooks types utils

write_file app/_layout.tsx <<'TSX'
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerBackTitle: "Back" }} />
    </QueryClientProvider>
  );
}
TSX

write_file app/index.tsx <<'TSX'
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
TSX

write_file app/bands/index.tsx <<'TSX'
import { Link } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";

const bands = [
  { id: 1, name: "Red Temples", score: 100 },
  { id: 2, name: "Example Perth Band", score: 82 },
];

export default function BandsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bands</Text>
      <FlatList
        data={bands}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link href={`/bands/${item.id}`} style={styles.row}>
            {item.name} — {item.score}
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  row: { paddingVertical: 14, borderBottomWidth: 1, fontSize: 17 },
});
TSX

write_file 'app/bands/[id].tsx' <<'TSX'
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
TSX

write_file app/bands/edit.tsx <<'TSX'
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function EditBandScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [name, setName] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{id ? "Edit Band" : "Add Band"}</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Band name" style={styles.input} />
      <Button title="Save" onPress={() => console.log({ id, name })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
});
TSX

for section in rankings venues contacts settings; do
  title="${section^}"
  write_file "app/$section/index.tsx" <<TSX
import { StyleSheet, Text, View } from "react-native";

export default function ${title}Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${title}</Text>
      <Text>${title} content goes here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
});
TSX
done

write_file app/events/index.tsx <<'TSX'
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function EventsScreen() {
  return <View style={styles.container}><Text style={styles.title}>Events</Text><Link href="/events/1">Open sample event</Link></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, gap: 16 }, title: { fontSize: 28, fontWeight: "700" } });
TSX

write_file 'app/events/[id].tsx' <<'TSX'
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View style={styles.container}><Text style={styles.title}>Event Details</Text><Text>Event ID: {id}</Text></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, gap: 12 }, title: { fontSize: 28, fontWeight: "700" } });
TSX

write_file app/lineups/index.tsx <<'TSX'
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function LineupsScreen() {
  return <View style={styles.container}><Text style={styles.title}>Lineups</Text><Link href="/lineups/builder">Create a lineup</Link></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 24, gap: 16 }, title: { fontSize: 28, fontWeight: "700" } });
TSX

write_file app/lineups/builder.tsx <<'TSX'
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
TSX

write_file components/BandCard.tsx <<'TSX'
import { StyleSheet, Text, View } from "react-native";
export function BandCard({ name, score }: { name: string; score?: number }) {
  return <View style={styles.card}><Text style={styles.name}>{name}</Text>{score !== undefined && <Text>Score: {score}</Text>}</View>;
}
const styles = StyleSheet.create({ card: { padding: 16, borderWidth: 1, borderRadius: 12, gap: 6 }, name: { fontSize: 18, fontWeight: "600" } });
TSX

write_file services/api.ts <<'TS'
import axios from "axios";
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",
  timeout: 10000,
});
TS

write_file services/sqlite.ts <<'TS'
import * as SQLite from "expo-sqlite";
let database: SQLite.SQLiteDatabase | null = null;
export async function getDatabase() {
  if (!database) database = await SQLite.openDatabaseAsync("support-band-db.sqlite");
  return database;
}
export async function initialiseDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS app_metadata (
      metadata_key TEXT PRIMARY KEY NOT NULL,
      metadata_value TEXT
    );
  `);
}
TS

write_file hooks/useBands.ts <<'TS'
import { useQuery } from "@tanstack/react-query";
export type BandListItem = { id: number; name: string; score?: number };
async function fetchBands(): Promise<BandListItem[]> { return []; }
export function useBands() {
  return useQuery({ queryKey: ["bands"], queryFn: fetchBands });
}
TS

write_file types/Band.ts <<'TS'
export type Band = {
  bandId: number;
  bandName: string;
  hometown?: string;
  memberCount?: number;
  status: "active" | "inactive" | "hiatus" | "unknown";
  isOurBand: boolean;
  isVerified: boolean;
};
TS

write_file utils/ranking.ts <<'TS'
export type WeightedScore = { score: number; weight: number; confidence?: number };
export function calculateRanking(scores: WeightedScore[]): number {
  const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  const total = scores.reduce((sum, item) => {
    const confidence = item.confidence === undefined ? 1 : 0.8 + Math.min(5, Math.max(1, item.confidence)) * 0.04;
    return sum + (item.score / 10) * item.weight * confidence;
  }, 0);
  return Number(((total / totalWeight) * 100).toFixed(2));
}
TS

write_file database/schema.sql <<'SQL'
-- Local SQLite schema placeholder.
SQL

write_file database/seed.sql <<'SQL'
-- Local SQLite seed data placeholder.
SQL

echo
echo "Scaffold complete."
echo "Run: npx expo start --clear"
echo "Use ./scaffold-pages.sh --force to overwrite generated files."
