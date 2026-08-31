import {
    ActivityIndicator,
    Text,
    View,
} from "react-native";

import { useDrinkTokens } from "../../hooks/useDrinkTokens";
import { Button } from "../ui/Button";
import { styles } from "./DrinkRiderEditor.styles";

type Props = {
    gigId: number;
    bandId: number;
    bandName: string;
    memberCount: number;
};

export function DrinkRiderEditor({
    gigId,
    bandId,
    bandName,
    memberCount,
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

    const maxTokens = memberCount * 2;

    const total = tokens.length;

    const used = tokens.filter(
        (token) => token.used
    ).length;

    const remaining = total - used;

    const canAdd =
        memberCount > 0 &&
        total < maxTokens;

    const canRemove =
        remaining > 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.content}>
                    <Text style={styles.title}>
                        {bandName.toUpperCase()} DRINK RIDER
                    </Text>

                    <Text style={styles.summary}>
                        {total} allocated ·{" "}
                        {used} used ·{" "}
                        {remaining} remaining
                    </Text>

                    {memberCount > 0 ? (
                        <Text style={styles.helper}>
                            Maximum {maxTokens} drinks ·{" "}
                            {memberCount} members × 2
                        </Text>
                    ) : (
                        <Text style={styles.helper}>
                            Set the band member count to allocate drinks.
                        </Text>
                    )}
                </View>

                <View style={styles.controls}>
                    <Button
                        title="−"
                        variant="counter"
                        disabled={!canRemove}
                        onPress={removeToken}
                    />

                    <View
                        style={
                            styles.countContainer
                        }
                    >
                        <Text style={styles.count}>
                            {total}
                        </Text>

                        <Text
                            style={
                                styles.countLabel
                            }
                        >
                            DRINKS
                        </Text>
                    </View>

                    <Button
                        title="+"
                        variant="counter"
                        disabled={!canAdd}
                        onPress={addToken}
                    />
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