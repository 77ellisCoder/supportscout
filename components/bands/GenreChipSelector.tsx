import { Genre } from "../../models/Genre";
import { styles } from "./GenreChipSelector.styles";
import { Pressable, Text, View } from "react-native";

type Props = {
    genres: Genre[];
    selectedGenreIds: number[];
    onChange: (ids: number []) => void;
    readOnly?: boolean;
};

export function GenreChipSelector({
    genres,
    selectedGenreIds,
    onChange,
    readOnly = false
}: Props) {

    function toggleGenre(genre: Genre) {
        const id = genre.id;
        if (selectedGenreIds.includes(id)) {
            onChange(
                selectedGenreIds.filter(
                    item => item !== id
                )
            );
        } else {
            onChange([
                ...selectedGenreIds,
                id,
            ]);
        }
    }

    return (
        <View style={styles.chips}>
            {genres.map((genre) => {
                const id = genre.id;
                const selected =
                    selectedGenreIds.includes(id);

                return (
                    <Pressable
                        key={id}
                        onPress={() =>
                            !readOnly && toggleGenre(genre)
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
                            {genre.name}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}