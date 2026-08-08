import {
    ActivityIndicator,
    Text,
    View,
} from "react-native";

import { colors } from "../../theme";
import { styles } from "./StatCard.styles";

type StatCardProps = {
    label: string;
    value: string | number;
    caption?: string;
    loading?: boolean;
    highlighted?: boolean;
};

export function StatCard({
    label,
    value,
    caption,
    loading = false,
    highlighted = false,
}: StatCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>
                {label}
            </Text>

            {loading ? (
                <View style={styles.valueContainer}>
                    <ActivityIndicator
                        size="small"
                        color={colors.primaryLight}
                    />
                </View>
            ) : (
                <Text
                    style={[
                        styles.value,
                        highlighted
                            ? styles.valueHighlighted
                            : styles.valueMuted,
                    ]}
                >
                    {value}
                </Text>
            )}

            {caption && (
                <Text style={styles.caption}>
                    {caption}
                </Text>
            )}
        </View>
    );
}