import { useMemo, useState } from "react";


import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { Button } from "../../components/Button";
import { Chip } from "../../components/Chip";
import { BandCard } from "../../components/bands/BandCard";
import { SearchBar } from "../../components/SearchBar";
import { useBands } from "../../hooks/useBands";
import { colors } from "../../theme";
import { styles } from "../../styles/bands.styles";

export default function BandsScreen() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  type SortOption = "name-asc" | "name-desc";

  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

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

  const sortedBands = useMemo(() => {
    const sorted = [...filteredBands];

    switch (sortBy) {
      case "name-desc":
        return sorted.sort((a, b) =>
          b.bandName.localeCompare(a.bandName)
        );

      case "name-asc":
      default:
        return sorted.sort((a, b) =>
          a.bandName.localeCompare(b.bandName)
        );
    }
  }, [filteredBands, sortBy]);

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
      <View style={styles.container}>
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

        {/* Sorting */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>SORT</Text>

          <Chip
            label="A–Z"
            selected={sortBy === "name-asc"}
            onPress={() => setSortBy("name-asc")}
          />

          <Chip
            label="Z–A"
            selected={sortBy === "name-desc"}
            onPress={() => setSortBy("name-desc")}
          />
        </View>

        <View style={styles.resultHeader}>
          <Text style={styles.resultCount}>
            {filteredBands.length}{" "}
            {filteredBands.length === 1
              ? "band"
              : "bands"}
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add band"
            onPress={() => router.push("/bands/create")}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
          >
            <Text style={styles.addButtonText}>
              + Add Band
            </Text>
          </Pressable>
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
            data={sortedBands}
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
    </View>
  );
}