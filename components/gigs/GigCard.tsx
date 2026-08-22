import { router } from "expo-router";
import {
    Pressable,
    Text,
    View,
} from "react-native";

import type { GigListItem } from "../../models/Gig";
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
    value: string
): Date {
    const [year, month, day] =
        value.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
}

function formatGigDay(
    value: string
): string {
    return String(
        parseGigDate(value).getDate()
    );
}

function formatGigMonth(
    value: string
): string {
    return parseGigDate(value)
        .toLocaleDateString("en-AU", {
            month: "short",
        })
        .toUpperCase();
}