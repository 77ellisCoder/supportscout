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

  const GENRES = useMemo(() => {
    const values = new Set<string>();

    bands.forEach((band) => {
      const description = band.shortDescription;

      if (!description) {
        return;
      }

      description
        .split(/[,/]/)
        .map((value) => value.trim())
        .filter(Boolean)
        .forEach((value) => values.add(value));
    });

    return [
      "All",
      ...Array.from(values).sort((a, b) =>
        a.localeCompare(b)
      ),
    ];
  }, [bands]);

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
          {filteredBands.length} {filteredBands.length === 1 ? "band" : "bands"}
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
          data={filteredBands}
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
                {selectedGenre === "All"
                  ? "Try a different search."
                  : `No bands match ${selectedGenre}.`}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}