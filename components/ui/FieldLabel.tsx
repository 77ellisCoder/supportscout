import {
    StyleSheet,
    Text,
    type StyleProp,
    type TextStyle,
} from "react-native";

import { colors } from "../../theme";

type FieldLabelProps = {
    label: string;
    required?: boolean;
    style?: StyleProp<TextStyle>;
};

export function FieldLabel({
    label,
    required = false,
    style,
}: FieldLabelProps) {
    return (
        <Text
            accessibilityLabel={required ? `${label}, required` : label}
            style={style}
        >
            {label}
            {required && <Text style={styles.requiredMark}> *</Text>}
        </Text>
    );
}

const styles = StyleSheet.create({
    requiredMark: {
        color: colors.danger,
    },
});