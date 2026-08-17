import { useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";

import { Chip } from "../../components/Chip";
import { SearchBar } from "../../components/SearchBar";
import { VenueCard } from "../../components/VenueCard/VenueCard";
import { useVenues } from "../../hooks/useVenues";
import { colors } from "../../theme";
import { styles } from "../../styles/venues.styles";

export default function VenuesScreen() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  type SortOption = "name-asc" | "name-desc";

  const [sortBy, setSortBy] =
    useState<SortOption>("name-asc");

  const {
    data: venues = [],
    isLoading,
    error,
  } = useVenues();

  const filteredVenues = useMemo(() => {
    const searchTerm = search
      .trim()
      .toLowerCase();

    return venues.filter((venue) => {
      const matchesSearch =
        !searchTerm ||
        venue.venueName
          .toLowerCase()
          .includes(searchTerm) ||
        venue.suburb
          ?.toLowerCase()
          .includes(searchTerm) ||
        venue.shortDescription
          ?.toLowerCase()
          .includes(searchTerm);

      const matchesType =
        selectedType === "All" ||
        formatVenueType(venue.venueType) ===
        selectedType;

      return matchesSearch && matchesType;
    });
  }, [venues, search, selectedType]);

  const sortedVenues = useMemo(() => {
    const sorted = [...filteredVenues];

    switch (sortBy) {
      case "name-desc":
        return sorted.sort((a, b) =>
          b.venueName.localeCompare(
            a.venueName
          )
        );

      case "name-asc":
      default:
        return sorted.sort((a, b) =>
          a.venueName.localeCompare(
            b.venueName
          )
        );
    }
  }, [filteredVenues, sortBy]);

  const VENUE_TYPES = useMemo(() => {
    const values = new Set<string>();

    venues.forEach((venue) => {
      const type = formatVenueType(
        venue.venueType
      );

      if (type) {
        values.add(type);
      }
    });

    return [
      "All",
      ...Array.from(values).sort(
        (a, b) => a.localeCompare(b)
      ),
    ];
  }, [venues]);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          VENUE FINDER
        </Text>

        <Text style={styles.title}>
          Find the right room.
        </Text>

        <Text style={styles.subtitle}>
          Search Perth venues already in
          SupportScout.
        </Text>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Search venues..."
      />

      <View style={styles.chipRow}>
        {VENUE_TYPES.map((type) => (
          <Chip
            key={type}
            label={type}
            selected={
              selectedType === type
            }
            onPress={() =>
              setSelectedType(type)
            }
          />
        ))}
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>
          SORT
        </Text>

        <Chip
          label="A–Z"
          selected={
            sortBy === "name-asc"
          }
          onPress={() =>
            setSortBy("name-asc")
          }
        />

        <Chip
          label="Z–A"
          selected={
            sortBy === "name-desc"
          }
          onPress={() =>
            setSortBy("name-desc")
          }
        />
      </View>

      <View style={styles.resultHeader}>
        <Text style={styles.resultCount}>
          {filteredVenues.length}{" "}
          {filteredVenues.length === 1
            ? "venue"
            : "venues"}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator
            color={colors.primaryLight}
          />

          <Text style={styles.loadingText}>
            Searching...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Unable to load venues.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedVenues}
          keyExtractor={(item) =>
            String(item.venueId)
          }
          contentContainerStyle={
            styles.list
          }
          renderItem={({ item }) => (
            <VenueCard
              id={item.venueId}
              name={item.venueName}
              suburb={item.suburb}
              venueType={item.venueType}
              description={
                item.shortDescription
              }
              capacity={item.capacity}
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text
                style={styles.emptyTitle}
              >
                No venues found
              </Text>

              <Text
                style={styles.emptyText}
              >
                {selectedType === "All"
                  ? "Try a different search."
                  : `No venues match ${selectedType}.`}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

function formatVenueType(
  venueType?: string | null
): string {
  if (!venueType) {
    return "";
  }

  return venueType
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}