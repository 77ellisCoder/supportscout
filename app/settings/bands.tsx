import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    useMemo,
    useState,
} from "react";

import {
    useBands,
} from "../../hooks/useBands";

import {
    useAddMyBand,
    useMyBands,
    useRemoveMyBand,
} from "../../hooks/useUserBands";

import {
    Button,
} from "../../components/ui/Button";

import {
    styles,
} from "../../styles/manage-bands.styles";

export default function ManageBandsScreen() {
    const [
        search,
        setSearch,
    ] = useState("");

    const {
        data: myBands = [],
        isLoading: loadingMyBands,
    } = useMyBands();

    const {
        data: allBands = [],
        isLoading: loadingBands,
    } = useBands();

    const addBand =
        useAddMyBand();

    const removeBand =
        useRemoveMyBand();

    const myBandIds =
        useMemo(
            () =>
                new Set(
                    myBands.map(
                        (band) =>
                            band.bandId
                    )
                ),
            [myBands]
        );

    const availableBands =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return allBands
                .filter(
                    (band) =>
                        !myBandIds.has(
                            band.bandId
                        )
                )
                .filter(
                    (band) =>
                        !query ||
                        band.bandName
                            .toLowerCase()
                            .includes(
                                query
                            )
                );
        }, [
            allBands,
            myBandIds,
            search,
        ]);

    const isLoading =
        loadingMyBands ||
        loadingBands;

    async function handleAdd(
        bandId: number
    ) {
        await addBand.mutateAsync(
            bandId
        );
    }

    async function handleRemove(
        bandId: number
    ) {
        await removeBand.mutateAsync(
            bandId
        );
    }

    return (
        <ScrollView
            contentContainerStyle={
                styles.container
            }
        >
            <View
                style={
                    styles.header
                }
            >
                <Text
                    style={
                        styles.title
                    }
                >
                    My Bands
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Manage the bands you're
                    associated with.
                </Text>
            </View>

            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <>
                    <View
                        style={
                            styles.card
                        }
                    >
                        <Text
                            style={
                                styles.sectionLabel
                            }
                        >
                            YOUR BANDS
                        </Text>

                        {myBands.length ===
                            0 ? (
                            <Text
                                style={
                                    styles.empty
                                }
                            >
                                You haven't added
                                any bands yet.
                            </Text>
                        ) : (
                            <View
                                style={
                                    styles.list
                                }
                            >
                                {myBands.map(
                                    (band) => (
                                        <View
                                            key={
                                                band.bandId
                                            }
                                            style={
                                                styles.row
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.bandDetails
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

                                            <Button
                                                title="Remove"
                                                variant="secondary"
                                                disabled={
                                                    removeBand.isPending
                                                }
                                                onPress={() =>
                                                    handleRemove(
                                                        band.bandId
                                                    )
                                                }
                                            />
                                        </View>
                                    )
                                )}
                            </View>
                        )}
                    </View>

                    <View
                        style={
                            styles.card
                        }
                    >
                        <Text
                            style={
                                styles.sectionLabel
                            }
                        >
                            ADD A BAND
                        </Text>

                        <TextInput
                            value={
                                search
                            }
                            onChangeText={
                                setSearch
                            }
                            placeholder="Search bands..."
                            placeholderTextColor="#747482"
                            style={
                                styles.searchInput
                            }
                        />

                        <View
                            style={
                                styles.list
                            }
                        >
                            {availableBands.map(
                                (band) => (
                                    <View
                                        key={
                                            band.bandId
                                        }
                                        style={
                                            styles.row
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

                                        <Button
                                            title="Add"
                                            variant="secondary"
                                            disabled={
                                                addBand.isPending
                                            }
                                            onPress={() =>
                                                handleAdd(
                                                    band.bandId
                                                )
                                            }
                                        />
                                    </View>
                                )
                            )}

                            {availableBands.length ===
                                0 && (
                                    <Text
                                        style={
                                            styles.empty
                                        }
                                    >
                                        No matching bands.
                                    </Text>
                                )}
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    );
}