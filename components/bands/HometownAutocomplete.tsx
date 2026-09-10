import { useMemo, useState } from "react";

import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import waTowns from "../../assets/data/wa-towns.json";

import { colors } from "../../theme";
import { styles } from "../../styles/hometown-autocomplete.styles";

type Props = {
    value: string;
    onChange: (value: string) => void;
};

export function HometownAutocomplete({
    value,
    onChange,
}: Props) {
    const [focused, setFocused] =
        useState(false);

    const matches = useMemo(() => {
        const search = value
            .trim()
            .toLowerCase();

        if (!search) {
            return [];
        }

        return waTowns
            .filter((town) =>
                town
                    .toLowerCase()
                    .includes(search)
            )
            .slice(0, 10);
    }, [value]);

    return (
        <View style={styles.field}>
            <Text style={styles.label}>
                Hometown
            </Text>

            <TextInput
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocused(true)}
                placeholder="Start typing a WA town..."
                placeholderTextColor={
                    colors.textMuted
                }
                style={styles.input}
            />

            {focused &&
                matches.length > 0 && (
                    <View
                        style={
                            styles.dropdown
                        }
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            nestedScrollEnabled
                            style={
                                styles.dropdownScroll
                            }
                        >
                            {matches.map(
                                (town) => (
                                    <Pressable
                                        key={
                                            town
                                        }
                                        style={
                                            styles.option
                                        }
                                        onPress={() => {
                                            onChange(
                                                town
                                            );
                                            setFocused(
                                                false
                                            );
                                        }}
                                    >
                                        <Text
                                            style={
                                                styles.optionText
                                            }
                                        >
                                            {town}
                                        </Text>
                                    </Pressable>
                                )
                            )}
                        </ScrollView>
                    </View>
                )}
        </View>
    );
}