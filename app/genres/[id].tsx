import { router, useLocalSearchParams } from "expo-router";

import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";

import { BackButton } from "../../components/navigation/BackButton";
import { GigSection } from "../../components/gigs/GigSection";

import { useGenre } from "../../hooks/useGenre";
import { useGenres, useGenresByIds } from "../../hooks/useGenres";

import { colors } from "../../theme";
import { detailStyles as styles } from "../../styles/shared/details.styles";

import { Button } from "../../components/ui/Button";

export default function GenreDetailsScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const genreId = Number(id);

  const {
    data: genre,
    isLoading,
    error,
  } = useGenre(genreId);

  const {
    data: genres = [],
  } = useGenres();

  console.log("GenreDetailsScreen: genres", genres);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          color={colors.primaryLight}
        />

        <Text style={styles.loadingText}>
          Loading genre...
        </Text>
      </View>
    );
  }

  if (error || !genre) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load genre
        </Text>

        <Text style={styles.errorText}>
          {error
            ? error.message
            : "Genre not found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
    >
      <BackButton
        label="Back to Genres"
        fallbackRoute="/genres"
      />

      <View style={styles.hero}>
        <View style={styles.titleRow}>
          <View style={styles.titleContent}>
            <Text style={styles.eyebrow}>
              GENRE PROFILE
            </Text>

            <Text style={styles.title}>
              {genre.genreName}
            </Text>

          </View>
        </View>
      </View>

      <View style={styles.actions}>
        {/* Edit button */}
        <Button
          title="Edit Genre"
          onPress={() =>
            router.push({
              pathname: "/genres/edit",
              params: {
                id: genre.genreId,
              },
            })
          }
        />
      </View>
    </ScrollView >
  );
}