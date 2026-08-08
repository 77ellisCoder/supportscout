import { router } from "expo-router";
import { useMemo, useState } from "react";


import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { Chip } from "../../components/Chip";
import { BandCard } from "../../components/BandCard";
import { SearchBar } from "../../components/SearchBar";
import { useBands } from "../../hooks/useBands";
import { colors } from "../../theme";
import { styles } from "../../styles/bands.styles";

export default function BandsScreen() {
  const [search, setSearch] = useState("");

  // TOOD: get from database / API call?
  const GENRES = [
    "All",
    "Indie Rock",
    "Surf Rock",
    "Alternative",
    "Indie Pop",
    "Reggae",
    "Rock",
    "Hard Rock"
  ];

  const [selectedGenre, setSelectedGenre] = useState("All");

  const {
    data: bands = [],
    isLoading,
    error,
  } = useBands(search);

  const filteredBands = useMemo(() => {
    if (!selectedGenre || selectedGenre === "All") {
      return bands;
    }

    const genre = selectedGenre.toLowerCase();

    return bands.filter((band) =>
      band.shortDescription
        ?.toLowerCase()
        .includes(genre)
    );
  }, [bands, selectedGenre]);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>BAND FINDER</Text>
        <Text style={styles.title}>Find the right act.</Text>

        <Text style={styles.subtitle}>
          Search Perth artists already in SupportScout.
        </Text>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.chipRow}>
        <View style={styles.chipRow}>
          {GENRES.map((genre) => (
            <Chip
              key={genre}
              label={genre}
              selected={selectedGenre === genre}
              onPress={() => setSelectedGenre(genre)}
            />
          ))}
        </View>
      </View>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {bands.length} {bands.length === 1 ? "band" : "bands"}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primaryLight} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Unable to load bands.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bands}
          keyExtractor={(item) => String(item.bandId)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BandCard
              id={item.bandId}
              name={item.bandName}
              description={item.shortDescription}
              hometown={item.hometown}
              memberCount={item.memberCount}
            //score={item.score}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyTitle}>
                No bands found
              </Text>

              <Text style={styles.emptyText}>
                Try a different search.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}