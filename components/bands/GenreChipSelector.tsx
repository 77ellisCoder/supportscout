import { Genre } from "../../repositories/GenreRepository";
import { styles } from "./GenreChipSelector.styles";
import { Pressable, Text, View } from "react-native";

type Props = {
    genres: Genre[];
    selectedGenreIds: number[];
    onChange: (genreIds: number []) => void;
    readonly?: boolean;
};

export function GenreChipSelector({
    genres,
    selectedGenreIds,
    onChange,
    readonly = false
}: Props) {

    function toggleGenre(genre: Genre) {
        const genreId = genre.genreId;
        if (selectedGenreIds.includes(genreId)) {
            onChange(
                selectedGenreIds.filter(
                    item => item !== genreId
                )
            );
        } else {
            onChange([
                ...selectedGenreIds,
                genreId,
            ]);
        }
    }

    return (
        <View style={styles.chips}>
            {genres.map((genre) => {
                const genreId = genre.genreId;
                const selected =
                    selectedGenreIds.includes(genreId);

                return (
                    <Pressable
                        key={genreId}
                        onPress={() =>
                            !readonly && toggleGenre(genre)
                        }
                        style={[
                            styles.chip,
                            selected &&
                            styles.chipSelected,
                        ]}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                selected &&
                                styles.chipTextSelected,
                            ]}
                        >
                            {genre.genreName}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}