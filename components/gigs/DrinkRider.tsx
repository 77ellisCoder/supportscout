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
    gigDate: string;
};

function getLocalDateString(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(
        now.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function DrinkRider({
    gigId,
    bandId,
    bandName,
    gigDate
}: Props) {

    const today = getLocalDateString();

    const isGigDay = gigDate === today;
    const isBeforeGig = today < gigDate;
    const isAfterGig = today > gigDate;

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
                {isGigDay &&
                    `${remaining} of ${tokens.length} remaining`}

                {isBeforeGig &&
                    `${tokens.length} allocated • Available on gig day`}

                {isAfterGig &&
                    `${tokens.length - remaining} used • Gig complete`}
            </Text>

            <View style={styles.tokens}>
                {tokens.map((token, index) => (
                    <Pressable
                        key={token.tokenId}
                        disabled={token.used || !isGigDay}
                        onPress={() =>
                            useToken(token.tokenId)
                        }
                        style={({ pressed }) => [
                            styles.token,

                            token.used &&
                            styles.tokenUsed,

                            !isGigDay &&
                            !token.used &&
                            styles.tokenUnavailable,

                            pressed &&
                            !token.used &&
                            isGigDay &&
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