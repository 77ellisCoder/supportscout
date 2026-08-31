import type { ReactNode } from "react";
import {
    Text,
    View,
} from "react-native";

import { styles } from "./PageHeader.styles";

type PageHeaderProps = {
    title: string;
    action?: ReactNode;
};

export function PageHeader({
    title,
    action,
}: PageHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {title}
            </Text>

            {action && (
                <View style={styles.action}>
                    {action}
                </View>
            )}
        </View>
    );
}