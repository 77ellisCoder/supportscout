import type { ReactNode } from "react";
import {
    Text,
    View,
} from "react-native";

import { styles } from "./PageHeader.styles";

type PageHeaderProps = {
    title: string;
    eyebrow?: string;
    subtitle?: string;
    action?: ReactNode;
};

export function PageHeader({
    title,
    eyebrow,
    subtitle,
    action,
}: PageHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {eyebrow && (
                    <Text style={styles.eyebrow}>
                        {eyebrow}
                    </Text>
                )}

                <Text style={styles.title}>
                    {title}
                </Text>

                {subtitle && (
                    <Text style={styles.subtitle}>
                        {subtitle}
                    </Text>
                )}
            </View>

            {action && (
                <View style={styles.action}>
                    {action}
                </View>
            )}
        </View>
    );
}