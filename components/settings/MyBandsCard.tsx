import {
    ActivityIndicator,
    Text,
    View,
} from "react-native";

import {
    router,
} from "expo-router";

import {
    useMyBands,
} from "../../hooks/useUserBands";

import {
    Button,
} from "../ui/Button";

import {
    styles,
} from "../../styles/my-bands-card.styles";

export default function MyBandsCard() {
    const {
        data: bands = [],
        isLoading,
        error,
    } = useMyBands();

    return (
        <View
            style={
                styles.card
            }
        >
            <View
                style={
                    styles.content
                }
            >
                <Text
                    style={
                        styles.sectionLabel
                    }
                >
                    MY BANDS
                </Text>

                {isLoading ? (
                    <ActivityIndicator />
                ) : error ? (
                    <Text
                        style={
                            styles.error
                        }
                    >
                        Unable to load your bands.
                    </Text>
                ) : bands.length === 0 ? (
                    <Text
                        style={
                            styles.empty
                        }
                    >
                        You haven't added any bands yet.
                    </Text>
                ) : (
                    <View
                        style={
                            styles.bandList
                        }
                    >
                        {bands.map(
                            (band) => (
                                <View
                                    key={
                                        band.bandId
                                    }
                                    style={
                                        styles.bandRow
                                    }
                                >
                                    <Text
                                        style={
                                            styles.bandName
                                        }
                                    >
                                        {
                                            band.bandName
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.relationship
                                        }
                                    >
                                        {
                                            band.relationship
                                        }
                                    </Text>
                                </View>
                            )
                        )}
                    </View>
                )}
            </View>

            <Button
                title="Manage bands"
                variant="secondary"
                onPress={() =>
                    router.push(
                        "/settings/bands"
                    )
                }
            />
        </View>
    );
}