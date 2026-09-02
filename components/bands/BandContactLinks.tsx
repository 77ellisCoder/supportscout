import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

import { colors } from "../../theme";
import type { BandFormValues } from "./BandForm";
import { styles } from "./BandContactLinks.styles";

type Props = {
    values: BandFormValues;

    onChange: <K extends keyof BandFormValues>(
        key: K,
        value: BandFormValues[K]
    ) => void;
};

export function BandContactLinks({
    values,
    onChange,
}: Props) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                CONTACT & LINKS
            </Text>

            <View style={styles.field}>
                <Text style={styles.label}>
                    Booking Contact
                </Text>

                <TextInput
                    value={values.bookingContactName}
                    onChangeText={(value) =>
                        onChange(
                            "bookingContactName",
                            value
                        )
                    }
                    placeholder="Contact name"
                    placeholderTextColor={colors.textMuted}
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>
                    Contact Email
                </Text>

                <TextInput
                    value={values.contactEmail}
                    onChangeText={(value) =>
                        onChange(
                            "contactEmail",
                            value
                        )
                    }
                    placeholder="bookings@example.com"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>
                    Instagram
                </Text>

                <TextInput
                    value={values.instagramUrl}
                    onChangeText={(value) =>
                        onChange(
                            "instagramUrl",
                            value
                        )
                    }
                    placeholder="https://instagram.com/..."
                    placeholderTextColor={colors.textMuted}
                    keyboardType="url"
                    autoCapitalize="none"
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>
                    Facebook
                </Text>

                <TextInput
                    value={values.facebookUrl}
                    onChangeText={(value) =>
                        onChange(
                            "facebookUrl",
                            value
                        )
                    }
                    placeholder="https://facebook.com/..."
                    placeholderTextColor={colors.textMuted}
                    keyboardType="url"
                    autoCapitalize="none"
                    style={styles.input}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>
                    Website
                </Text>

                <TextInput
                    value={values.websiteUrl}
                    onChangeText={(value) =>
                        onChange(
                            "websiteUrl",
                            value
                        )
                    }
                    placeholder="https://..."
                    placeholderTextColor={colors.textMuted}
                    keyboardType="url"
                    autoCapitalize="none"
                    style={styles.input}
                />
            </View>
        </View>
    );
}

function LinkRow({
    icon,
    label,
    url,
}: {
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    url: string;
}) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
            ]}
            onPress={() => Linking.openURL(url)}
        >
            <Ionicons
                name={icon}
                size={18}
                color={colors.primaryLight}
            />

            <Text style={styles.link}>
                {label}
            </Text>

            <Ionicons
                name="open-outline"
                size={14}
                color={colors.textMuted}
            />
        </Pressable>
    );
}