import {
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import {
    Button,
} from "../../components/ui/Button";

import {
    useCreateRehearsalProposal,
} from "../../hooks/useRehearsalProposal";

import {
    useRehearsalLocations,
} from "../../hooks/useRehearsalLocations";

import {
    colors,
} from "../../theme";

export default function ProposeRehearsalScreen() {
    const params =
        useLocalSearchParams<{
            bandId: string;
            start: string;
            end: string;
        }>();

    const bandId =
        Number(
            params.bandId
        );

    const startAt =
        params.start;

    const endAt =
        params.end;

    const locations =
        useRehearsalLocations(
            bandId
        );

    const proposal =
        useCreateRehearsalProposal();

    const [
        selectedLocationId,
        setSelectedLocationId,
    ] =
        useState<
            number | null
        >(null);

    const [
        customLocation,
        setCustomLocation,
    ] =
        useState("");

    const [
        useCustomLocation,
        setUseCustomLocation,
    ] =
        useState(false);

    const [
        notes,
        setNotes,
    ] =
        useState("");

    const startDate =
        useMemo(
            () =>
                new Date(
                    startAt
                ),
            [startAt]
        );

    const endDate =
        useMemo(
            () =>
                new Date(
                    endAt
                ),
            [endAt]
        );

    const valid =
        Number.isFinite(
            bandId
        ) &&
        !Number.isNaN(
            startDate.getTime()
        ) &&
        !Number.isNaN(
            endDate.getTime()
        );

    const hasLocation =
        useCustomLocation
            ? customLocation.trim().length > 0
            : selectedLocationId !== null;

    async function handleSubmit() {
        if (!valid || !hasLocation) {
            return;
        }

        await proposal.mutateAsync({
            bandId,

            startAt:
                startDate.toISOString(),

            endAt:
                endDate.toISOString(),

            rehearsalLocationId:
                useCustomLocation
                    ? null
                    : selectedLocationId,

            location:
                useCustomLocation
                    ? (
                        customLocation.trim() ||
                        null
                    )
                    : null,

            notes:
                notes.trim() ||
                null,
        });

        router.replace({
            pathname:
                "/bands/[id]",

            params: {
                id:
                    String(
                        bandId
                    ),
            },
        });
    }

    if (!valid) {
        return (
            <View
                style={{
                    flex: 1,

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    backgroundColor:
                        colors.background,
                }}
            >
                <Text
                    style={{
                        color:
                            colors.danger,
                    }}
                >
                    Invalid rehearsal slot.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,

                padding: 24,

                backgroundColor:
                    colors.background,
            }}
        >
            <View
                style={{
                    width: "100%",

                    maxWidth: 720,

                    gap: 20,
                }}
            >
                <View
                    style={{
                        gap: 6,
                    }}
                >
                    <Text
                        style={{
                            color:
                                colors.text,

                            fontSize:
                                28,

                            fontWeight:
                                "700",
                        }}
                    >
                        Propose Rehearsal
                    </Text>

                    <Text
                        style={{
                            color:
                                colors.textSecondary,
                        }}
                    >
                        Suggest this shared
                        availability slot to
                        the band.
                    </Text>
                </View>

                <View
                    style={{
                        padding: 16,

                        borderRadius: 12,

                        borderWidth: 1,

                        borderColor:
                            colors.border,

                        backgroundColor:
                            colors.surface,

                        gap: 6,
                    }}
                >
                    <Text
                        style={{
                            color:
                                colors.text,

                            fontWeight:
                                "700",
                        }}
                    >
                        {startDate.toLocaleDateString(
                            "en-AU",
                            {
                                weekday:
                                    "long",

                                day:
                                    "numeric",

                                month:
                                    "long",
                            }
                        )}
                    </Text>

                    <Text
                        style={{
                            color:
                                colors.primaryLight,

                            fontSize:
                                18,

                            fontWeight:
                                "600",
                        }}
                    >
                        {startDate.toLocaleTimeString(
                            "en-AU",
                            {
                                hour:
                                    "numeric",

                                minute:
                                    "2-digit",
                            }
                        )}

                        {" – "}

                        {endDate.toLocaleTimeString(
                            "en-AU",
                            {
                                hour:
                                    "numeric",

                                minute:
                                    "2-digit",
                            }
                        )}
                    </Text>
                </View>

                <View
                    style={{
                        gap: 8,
                    }}
                >
                    <Text
                        style={{
                            color:
                                colors.textSecondary,

                            fontSize:
                                12,

                            fontWeight:
                                "700",
                        }}
                    >
                        LOCATION
                    </Text>

                    {locations.isLoading ? (
                        <ActivityIndicator
                            color={
                                colors.primaryLight
                            }
                        />
                    ) : locations.error ? (
                        <Text
                            style={{
                                color:
                                    colors.danger,
                            }}
                        >
                            {
                                locations.error
                                    .message
                            }
                        </Text>
                    ) : (
                        <View
                            style={{
                                gap: 8,
                            }}
                        >
                            {locations.data?.map(
                                (
                                    location
                                ) => {
                                    const selected =
                                        !useCustomLocation &&
                                        selectedLocationId ===
                                        location.rehearsalLocationId;

                                    return (
                                        <Pressable
                                            key={
                                                location.rehearsalLocationId
                                            }

                                            onPress={() => {
                                                setUseCustomLocation(
                                                    false
                                                );

                                                setSelectedLocationId(
                                                    location.rehearsalLocationId
                                                );
                                            }}

                                            style={{
                                                padding:
                                                    12,

                                                borderRadius:
                                                    10,

                                                borderWidth:
                                                    1,

                                                borderColor:
                                                    selected
                                                        ? colors.primaryLight
                                                        : colors.border,

                                                backgroundColor:
                                                    selected
                                                        ? "rgba(139, 92, 246, 0.12)"
                                                        : colors.surface,

                                                gap: 3,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        colors.text,

                                                    fontWeight:
                                                        "700",
                                                }}
                                            >
                                                {location.isFavourite
                                                    ? "★ "
                                                    : ""}

                                                {
                                                    location.name
                                                }
                                            </Text>

                                            {location.address && (
                                                <Text
                                                    style={{
                                                        color:
                                                            colors.textSecondary,

                                                        fontSize:
                                                            12,
                                                    }}
                                                >
                                                    {
                                                        location.address
                                                    }

                                                    {location.suburb
                                                        ? `, ${location.suburb}`
                                                        : ""}

                                                    {location.state
                                                        ? ` ${location.state}`
                                                        : ""}

                                                    {location.postcode
                                                        ? ` ${location.postcode}`
                                                        : ""}
                                                </Text>
                                            )}

                                            {location.bandNotes && (
                                                <Text
                                                    style={{
                                                        color:
                                                            colors.primaryLight,

                                                        fontSize:
                                                            11,
                                                    }}
                                                >
                                                    {
                                                        location.bandNotes
                                                    }
                                                </Text>
                                            )}
                                        </Pressable>
                                    );
                                }
                            )}

                            <Pressable
                                onPress={() => {
                                    setUseCustomLocation(
                                        true
                                    );

                                    setSelectedLocationId(
                                        null
                                    );
                                }}

                                style={{
                                    padding: 12,

                                    borderRadius:
                                        10,

                                    borderWidth:
                                        1,

                                    borderColor:
                                        useCustomLocation
                                            ? colors.primaryLight
                                            : colors.border,

                                    backgroundColor:
                                        useCustomLocation
                                            ? "rgba(139, 92, 246, 0.12)"
                                            : colors.surface,
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            colors.text,

                                        fontWeight:
                                            "700",
                                    }}
                                >
                                    Other / custom
                                    location
                                </Text>
                            </Pressable>
                        </View>
                    )}

                    {useCustomLocation && (
                        <TextInput
                            value={
                                customLocation
                            }

                            onChangeText={
                                setCustomLocation
                            }

                            placeholder="House, studio, rehearsal room..."

                            placeholderTextColor="#746d7d"

                            style={{
                                minHeight:
                                    44,

                                marginTop:
                                    4,

                                paddingHorizontal:
                                    12,

                                borderWidth:
                                    1,

                                borderColor:
                                    colors.border,

                                borderRadius:
                                    9,

                                backgroundColor:
                                    colors.surface,

                                color:
                                    colors.text,
                            }}
                        />
                    )}
                </View>

                <View
                    style={{
                        gap: 8,
                    }}
                >
                    <Text
                        style={{
                            color:
                                colors.textSecondary,

                            fontSize:
                                12,

                            fontWeight:
                                "700",
                        }}
                    >
                        NOTES
                    </Text>

                    <TextInput
                        value={
                            notes
                        }

                        onChangeText={
                            setNotes
                        }

                        multiline

                        textAlignVertical="top"

                        placeholder="Anything the band should know..."

                        placeholderTextColor="#746d7d"

                        style={{
                            minHeight:
                                120,

                            padding:
                                12,

                            borderWidth:
                                1,

                            borderColor:
                                colors.border,

                            borderRadius:
                                9,

                            backgroundColor:
                                colors.surface,

                            color:
                                colors.text,
                        }}
                    />
                </View>

                {proposal.error && (
                    <Text
                        style={{
                            color:
                                colors.danger,
                        }}
                    >
                        {
                            proposal.error
                                .message
                        }
                    </Text>
                )}

                <Button
                    title="Propose rehearsal"

                    onPress={
                        handleSubmit
                    }

                    loading={
                        proposal.isPending
                    }

                    disabled={
                        !useCustomLocation &&
                        selectedLocationId ===
                        null
                    }

                    fullWidth
                />
            </View>
        </ScrollView>
    );
}