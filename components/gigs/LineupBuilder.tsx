import {
    Pressable,
    Text,
    View,
} from "react-native";

import type { Band } from "../../models/Band";
import { styles } from "../../styles/lineup-builder.styles";
import { DrinkRiderEditor } from "./DrinkRiderEditor";
import { Button } from "../ui/Button";

export type LineupRole =
    | "headliner"
    | "main_support"
    | "support"
    | "opener";

export type LineupItem = {
    bandId: number;
    role: LineupRole;
};

type LineupBuilderProps = {
    bands: Band[];
    value: LineupItem[];
    drinkRiderGigId?: number;
    onChange: (value: LineupItem[]) => void;
};

const ROLES: {
    value: LineupRole;
    label: string;
}[] = [
        {
            value: "headliner",
            label: "Headliner",
        },
        {
            value: "main_support",
            label: "Main Support",
        },
        {
            value: "support",
            label: "Support",
        },
        {
            value: "opener",
            label: "Opener",
        },
    ];

function applyRolesFromOrder(
    lineup: LineupItem[]
): LineupItem[] {
    return lineup.map((item, index) => {
        const isFirst = index === 0;
        const isLast =
            index === lineup.length - 1;

        let role: LineupRole;

        if (isFirst) {
            role = "headliner";
        } else if (isLast) {
            role = "opener";
        } else if (index === 1) {
            role = "main_support";
        } else {
            role = "support";
        }

        return {
            ...item,
            role,
        };
    });
}

export function LineupBuilder({
    bands,
    value,
    drinkRiderGigId,
    onChange,
}: LineupBuilderProps) {
    const selectedIds = new Set(
        value.map((item) => item.bandId)
    );

    const availableBands = bands
        .filter(
            (band) =>
                !selectedIds.has(band.bandId)
        )
        .sort((a, b) =>
            a.bandName.localeCompare(
                b.bandName
            )
        );

    function addBand(
        bandId: number
    ) {
        const next: LineupItem[] = [
            ...value,
            {
                bandId,
                role: "support",
            },
        ];

        onChange(
            applyRolesFromOrder(next)
        );
    }

    function removeBand(
        bandId: number
    ) {
        const next = value.filter(
            (item) =>
                item.bandId !== bandId
        );

        onChange(
            applyRolesFromOrder(next)
        );
    }

    function moveBand(
        index: number,
        direction: -1 | 1
    ) {
        const newIndex =
            index + direction;

        if (
            newIndex < 0 ||
            newIndex >= value.length
        ) {
            return;
        }

        const next = [...value];

        const [moved] =
            next.splice(index, 1);

        next.splice(
            newIndex,
            0,
            moved
        );

        onChange(
            applyRolesFromOrder(next)
        );
    }

    return (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>
                    LINEUP / BILLING
                </Text>

                <Text style={styles.sectionHint}>
                    Highest billed first
                </Text>
            </View>

            {value.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                        No bands added yet.
                    </Text>
                </View>
            ) : (
                <View style={styles.lineup}>
                    {value.map(
                        (item, index) => {
                            const band =
                                bands.find(
                                    (candidate) =>
                                        candidate.bandId ===
                                        item.bandId
                                );

                            if (!band) {
                                return null;
                            }

                            return (
                                <View
                                    key={
                                        item.bandId
                                    }
                                    style={
                                        styles.lineupCard
                                    }
                                >
                                    <View
                                        style={
                                            styles.lineupHeader
                                        }
                                    >
                                        <View
                                            style={
                                                styles.orderBadge
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.orderText
                                                }
                                            >
                                                {index + 1}
                                            </Text>
                                        </View>

                                        <View
                                            style={
                                                styles.bandContent
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
                                                    styles.currentRole
                                                }
                                            >
                                                {formatRole(
                                                    item.role
                                                )}
                                            </Text>
                                        </View>

                                        {drinkRiderGigId !=
                                            null && (
                                                <DrinkRiderEditor
                                                    gigId={
                                                        drinkRiderGigId
                                                    }
                                                    bandId={
                                                        item.bandId
                                                    }
                                                    bandName={
                                                        band.bandName
                                                    }
                                                    memberCount={
                                                        band.memberCount ??
                                                        0
                                                    }
                                                />
                                            )}

                                        <View
                                            style={
                                                styles.orderSection
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.orderLabel
                                                }
                                            >
                                                LINEUP ORDER
                                            </Text>

                                            <View
                                                style={
                                                    styles.orderControls
                                                }
                                            >
                                                <Button
                                                    title="↑"
                                                    variant="counter"
                                                    disabled={
                                                        index ===
                                                        0
                                                    }
                                                    onPress={() =>
                                                        moveBand(
                                                            index,
                                                            -1
                                                        )
                                                    }
                                                />

                                                <Button
                                                    title="↓"
                                                    variant="counter"
                                                    disabled={
                                                        index ===
                                                        value.length -
                                                        1
                                                    }
                                                    onPress={() =>
                                                        moveBand(
                                                            index,
                                                            1
                                                        )
                                                    }
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View
                                        style={
                                            styles.roleRow
                                        }
                                    >
                                        {ROLES.map(
                                            (role) => {
                                                const selected =
                                                    item.role ===
                                                    role.value;

                                                return (
                                                    <View
                                                        key={
                                                            role.value
                                                        }
                                                        style={[
                                                            styles.roleChip,
                                                            selected &&
                                                            styles.roleChipSelected,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.roleText,
                                                                selected &&
                                                                styles.roleTextSelected,
                                                            ]}
                                                        >
                                                            {
                                                                role.label
                                                            }
                                                        </Text>
                                                    </View>
                                                );
                                            }
                                        )}
                                    </View>

                                    <Pressable
                                        onPress={() =>
                                            removeBand(item.bandId)
                                        }
                                        style={({ pressed }) => [
                                            styles.removeAction,
                                            pressed &&
                                            styles.removeActionPressed,
                                        ]}
                                    >
                                        <Text style={styles.removeActionText}>
                                            Remove from Lineup
                                        </Text>
                                    </Pressable>
                                </View>
                            );
                        }
                    )}
                </View>
            )}

            {availableBands.length > 0 && (
                <>
                    <Text
                        style={
                            styles.availableLabel
                        }
                    >
                        ADD BAND
                    </Text>

                    <View
                        style={
                            styles.availableBands
                        }
                    >
                        {availableBands.map(
                            (band) => (
                                <Pressable
                                    key={
                                        band.bandId
                                    }
                                    onPress={() =>
                                        addBand(
                                            band.bandId
                                        )
                                    }
                                    style={({
                                        pressed,
                                    }) => [
                                            styles.addBandChip,
                                            pressed &&
                                            styles.addBandChipPressed,
                                        ]}
                                >
                                    <Text
                                        style={
                                            styles.addBandText
                                        }
                                    >
                                        +{" "}
                                        {
                                            band.bandName
                                        }
                                    </Text>
                                </Pressable>
                            )
                        )}
                    </View>
                </>
            )}
        </View>
    );
}

function formatRole(
    role: LineupRole
): string {
    switch (role) {
        case "headliner":
            return "HEADLINER";

        case "main_support":
            return "MAIN SUPPORT";

        case "opener":
            return "OPENER";

        case "support":
        default:
            return "SUPPORT";
    }
}