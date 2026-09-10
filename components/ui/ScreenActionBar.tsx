import type { ReactNode } from "react";

import {
    View,
} from "react-native";

import { styles } from "../../styles/screen-action-bar.styles";

type ScreenActionBarProps = {
    children: ReactNode;
};

export function ScreenActionBar({
    children,
}: ScreenActionBarProps) {
    return (
        <View style={styles.bar}>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}