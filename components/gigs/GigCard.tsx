import { router } from "expo-router";
import {
    Pressable,
    Text,
    View,
} from "react-native";

import type { GigListItem } from "../../models/Gig";
import { parseDateValue } from "../../utils/date";
import { styles } from "./GigCard.styles";

type GigCardProps = {
    gig: GigListItem;
};

export function GigCard({
    gig,
}: GigCardProps) {
    return (
        <Pressable
            onPress={() =>
                router.push(`/gigs/${gig.gigId}`)
            }
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.dateBadge}>
                <Text style={styles.dateDay}>
                    {formatGigDay(gig.gigDate)}
                </Text>

                <Text style={styles.dateMonth}>
                    {formatGigMonth(gig.gigDate)}
                </Text>

                <Text style={styles.dateYear}>
                    {formatGigYear(gig.gigDate)}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>
                    {gig.eventName ||
                        gig.venueName ||
                        "Gig"}
                </Text>

                {gig.venueName && (
                    <Text style={styles.venue}>
                        {gig.venueName}
                    </Text>
                )}

                <View style={styles.metaRow}>
                    {gig.suburb && (
                        <Text style={styles.meta}>
                            {gig.suburb}
                        </Text>
                    )}

                    {gig.suburb && (
                        <Text style={styles.metaDot}>
                            •
                        </Text>
                    )}

                    <Text style={styles.meta}>
                        {gig.bandCount}{" "}
                        {gig.bandCount === 1
                            ? "band"
                            : "bands"}
                    </Text>
                </View>
            </View>

            <Text style={styles.chevron}>
                ›
            </Text>
        </Pressable>
    );
}

function parseGigDate(
    value: string | null | undefined
): Date | null {
    return parseDateValue(value);
}

function formatGigDay(
    value: string | null | undefined
): string {
    const date = parseGigDate(value);

    return date ? String(date.getDate()) : "—";
}

function formatGigMonth(
    value: string | null | undefined
): string {
    const date = parseGigDate(value);

    if (!date) {
        return "—";
    }

    return date
        .toLocaleDateString("en-AU", {
            month: "short",
        })
        .toUpperCase();
}

function formatGigYear(
    value: string | null | undefined
): string {
    const date = parseGigDate(value);

    return date
        ? date.toLocaleDateString("en-AU", {
            year: "numeric",
        })
        : "—";
}