import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from "react-native";

import { useDrinkTokens } from "../../hooks/useDrinkTokens";
import { styles } from "./DrinkRiderEditor.styles";

type Props = {
    gigId: number;
    bandId: number;
    bandName: string;
};

export function DrinkRiderEditor({
    gigId,
    bandId,
    bandName,
}: Props) {
    const {
        data: tokens = [],
        isLoading,
        addToken,
        removeToken,
    } = useDrinkTokens(
        gigId,
        bandId
    );

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
            </View>
        );
    }

    const total = tokens.length;

    const used = tokens.filter(
        (token) => token.used
    ).length;

    const remaining = total - used;

    const canRemove =
        remaining > 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {bandName?.toUpperCase() ?? "BAND"} DRINK RIDERS
                    </Text>

                    <Text style={styles.summary}>
                        {total} allocated · {used} used ·{" "}
                        {remaining} remaining
                    </Text>
                </View>

                <View style={styles.controls}>
                    <Pressable
                        disabled={!canRemove}
                        accessibilityRole="button"
                        accessibilityLabel="Remove drink token"
                        onPress={removeToken}
                        style={({ pressed }) => [
                            styles.button,
                            !canRemove &&
                            styles.buttonDisabled,
                            pressed &&
                            canRemove &&
                            styles.buttonPressed,
                        ]}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                !canRemove &&
                                styles.buttonTextDisabled,
                            ]}
                        >
                            −
                        </Text>
                    </Pressable>

                    <View style={styles.countContainer}>
                        <Text style={styles.count}>
                            {total}
                        </Text>

                        <Text style={styles.countLabel}>
                            DRINKS
                        </Text>
                    </View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Add drink token"
                        onPress={addToken}
                        style={({ pressed }) => [
                            styles.button,
                            pressed &&
                            styles.buttonPressed,
                        ]}
                    >
                        <Text style={styles.buttonText}>
                            +
                        </Text>
                    </Pressable>
                </View>
            </View>

            {used > 0 && (
                <Text style={styles.helper}>
                    {used === 1
                        ? "1 token has already been redeemed and cannot be removed."
                        : `${used} tokens have already been redeemed and cannot be removed.`}
                </Text>
            )}
        </View>
    );
}