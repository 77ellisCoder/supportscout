import { useMemo, useState } from "react";


import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { Chip } from "../../components/Chip";
import { SearchBar } from "../../components/SearchBar";
import { colors } from "../../theme";
import { styles } from "../../styles/bands.styles";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { useGenres } from "../../hooks/useGenres";

export default function GenresScreen() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  type SortOption = "name-asc" | "name-desc";

  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  const {
    data: genres = [],
    isLoading,
    error,
  } = useGenres(search);


  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <PageHeader
          eyebrow="GENRE FINDER"
          title="Find the right genre."
          subtitle="Search for genres in SupportScout."
          action={
            <Button
              title="+ Add Genre"
              variant="add"
              onPress={() =>
                router.push("/genres/create")
              }
            />
          }
        />

        <SearchBar
          type={"genres"}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.chipRow}>
          {genres.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              selected={selectedGenre === genre.name}
              onPress={() => setSelectedGenre(genre.name)}
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

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primaryLight} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>
              Unable to load genres.
            </Text>
          </View>
        ) : (
          <FlatList
            data={genres}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <>
                <Text style={styles.item}>
                  {item.name}
                   
                  
                </Text>
                <Button
                    align="right"
                    title="Edit"
                    variant="add"
                    onPress={() => router.push(`/genres/${item.id}`)}
                  />

              </>
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.emptyTitle}>
                  No genres found
                </Text>

                <Text style={styles.emptyText}>
                  {selectedGenre === "All"
                    ? "Try a different search."
                    : `No genres match ${selectedGenre}.`}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}