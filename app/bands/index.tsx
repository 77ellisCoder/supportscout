import { useMemo, useState } from "react";


import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { Chip } from "../../components/Chip";
import { BandCard } from "../../components/bands/BandCard";
import { SearchBar } from "../../components/SearchBar";
import { useBands } from "../../hooks/useBands";
import { colors } from "../../theme";
import { styles } from "../../styles/bands.styles";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";

import { useGenres } from "../../hooks/useGenres";

export default function BandsScreen() {
  const [search, setSearch] = useState("");

  const { data: genres = [] } = useGenres();

  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  
  const selectedGenre =
    genres.find(
        (genre) => genre.id === selectedGenreId
    ) ?? null;

  type SortOption = "name-asc" | "name-desc";

  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const {
    data: bands = [],
    isLoading,
    error,
  } = useBands(search);

  const filteredBands = useMemo(() => {
    if (selectedGenreId === null) {
      return bands;
    }

    return bands.filter((band) =>
      band.genres?.some((genre) => genre.id === selectedGenreId)
    );
  }, [bands, selectedGenreId]);

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




  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <PageHeader
          eyebrow="BAND FINDER"
          title="Find the right act."
          subtitle="Search Perth artists already in SupportScout."
          action={
            <Button
              title="+ Add Band"
              variant="add"
              onPress={() =>
                router.push("/bands/create")
              }
            />
          }
        />

        <SearchBar
          type={"bands"}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.chipRow}>
          <Chip
            label="All"
            selected={selectedGenreId === null}
            onPress={() => setSelectedGenreId(null)}
          />

          {genres.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              selected={selectedGenreId === genre.id}
              onPress={() => setSelectedGenreId(genre.id)}
            />
          ))}
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
                  {selectedGenreId === null
                    ? "Try a different search."
                    : `No bands match ${selectedGenre?.name}.`}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}