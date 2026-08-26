import {
    Pressable,
    Text,
    View,
} from "react-native";

import { useDrinkTokens } from "../../hooks/useDrinkTokens";
import { styles } from "./DrinkRider.styles";

type Props = {
    gigId: number;
    bandId: number;
    bandName: string;
};

export function DrinkRider({
    gigId,
    bandId,
    bandName,
}: Props) {
    const {
        data: tokens = [],
        useToken,
    } = useDrinkTokens(
        gigId,
        bandId
    );

    if (tokens.length === 0) {
        return null;
    }

    const remaining = tokens.filter(
        (token) => !token.used
    ).length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {bandName?.toUpperCase() ?? "BAND"} DRINK RIDERS
            </Text>

            <Text style={styles.remaining}>
                {remaining} of {tokens.length} remaining
            </Text>

            <View style={styles.tokens}>
                {tokens.map((token, index) => (
                    <Pressable
                        key={token.tokenId}
                        disabled={token.used}
                        onPress={() =>
                            useToken(token.tokenId)
                        }
                        style={({ pressed }) => [
                            styles.token,

                            token.used &&
                            styles.tokenUsed,

                            pressed &&
                            !token.used &&
                            styles.tokenPressed,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tokenIcon,
                                token.used &&
                                styles.tokenTextUsed,
                            ]}
                        >
                            🍺
                        </Text>

                        <Text
                            style={[
                                styles.tokenText,
                                token.used &&
                                styles.tokenTextUsed,
                            ]}
                        >
                            {token.used
                                ? "USED"
                                : `DRINK ${index + 1}`}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}