import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

import {
    Linking,
    Pressable,
    Text,
    View,
} from "react-native";

import type { Band } from "../../models/Band";
import { colors } from "../../theme";
import { styles } from "./BandContactCard.styles";

type Props = {
    band: Band;
};

type IconName =
    ComponentProps<typeof Ionicons>["name"];

export function BandContactCard({
    band,
}: Props) {
    const hasContactDetails =
        band.bookingContactName ||
        band.contactEmail ||
        band.instagramUrl ||
        band.facebookUrl ||
        band.websiteUrl;

    if (!hasContactDetails) {
        return null;
    }

    return (
        <View style={styles.card}>
            <Text style={styles.heading}>
                CONTACT & LINKS
            </Text>

            <View style={styles.content}>
                {band.bookingContactName && (
                    <View style={styles.row}>
                        <View style={styles.icon}>
                            <Ionicons
                                name="person-outline"
                                size={18}
                                color={colors.textMuted}
                            />
                        </View>

                        <View style={styles.rowContent}>
                            <Text style={styles.label}>
                                Booking Contact
                            </Text>

                            <Text style={styles.value}>
                                {band.bookingContactName}
                            </Text>
                        </View>
                    </View>
                )}

                {band.contactEmail && (
                    <ContactLink
                        icon="mail-outline"
                        label="Email"
                        value={band.contactEmail}
                        url={`mailto:${band.contactEmail}`}
                    />
                )}

                {band.instagramUrl && (
                    <ContactLink
                        icon="logo-instagram"
                        label="Instagram"
                        value="Instagram"
                        url={band.instagramUrl}
                    />
                )}

                {band.facebookUrl && (
                    <ContactLink
                        icon="logo-facebook"
                        label="Facebook"
                        value="Facebook"
                        url={band.facebookUrl}
                    />
                )}

                {band.websiteUrl && (
                    <ContactLink
                        icon="globe-outline"
                        label="Website"
                        value={formatWebsite(
                            band.websiteUrl
                        )}
                        url={band.websiteUrl}
                    />
                )}
            </View>
        </View>
    );
}

function ContactLink({
    icon,
    label,
    value,
    url,
}: {
    icon: IconName;
    label: string;
    value: string;
    url: string;
}) {
    async function handlePress() {
        const targetUrl = normalizeUrl(url);

        try {
            await Linking.openURL(targetUrl);
        } catch (error) {
            console.warn(
                "Unable to open contact link:",
                targetUrl,
                error
            );
        }
    }

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
            ]}
        >
            <View style={styles.icon}>
                <Ionicons
                    name={icon}
                    size={18}
                    color={colors.primaryLight}
                />
            </View>

            <View style={styles.rowContent}>
                <Text style={styles.label}>
                    {label}
                </Text>

                <Text
                    style={styles.link}
                    numberOfLines={1}
                >
                    {value}
                </Text>
            </View>

            <Ionicons
                name="open-outline"
                size={15}
                color={colors.textMuted}
            />
        </Pressable>
    );
}

function formatWebsite(url: string): string {
    return url
        .replace(/^https?:\/\//i, "")
        .replace(/\/$/, "");
}

function normalizeUrl(url: string): string {
    const trimmed = url.trim();

    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://")
    ) {
        return trimmed;
    }

    return `https://${trimmed}`;
}