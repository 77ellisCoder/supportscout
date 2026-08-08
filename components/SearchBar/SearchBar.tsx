import { TextInput, View } from "react-native";
import { styles } from "./SearchBar.styles";

type SearchBarProps = {
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
};

export function SearchBar({
    value,
    onChangeText,
    placeholder = "Search bands...",
}: SearchBarProps) {
    return (
        <View style={styles.wrapper}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#747482"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
            />
        </View>
    );
}