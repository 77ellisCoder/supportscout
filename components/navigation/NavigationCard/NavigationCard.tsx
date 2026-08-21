import { router, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { styles } from "./NavigationCard.styles";

type NavigationCardProps = {
    href: Href;
    icon: string;
    title: string;
    description: string;
};

export function NavigationCard({
    href,
    icon,
    title,
    description,
}: NavigationCardProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${title}: ${description}`}
            onPress={() => router.push(href)}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
            ]}
        >
            <View style={styles.icon}>
                <Text style={styles.iconText}>
                    {icon}
                </Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>
                    {title}
                </Text>

                <Text style={styles.description}>
                    {description}
                </Text>
            </View>

            <Text style={styles.chevron}>
                ›
            </Text>
        </Pressable>
    );
}