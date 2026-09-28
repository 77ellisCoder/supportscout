import { router } from "expo-router";
import { Alert, Platform, View } from "react-native";
import { useState } from "react"

import { useQueryClient } from "@tanstack/react-query";

import { MenuItem } from "./MenuItem";
import { styles } from "./AppMenu.styles";

import {
    useMyBands,
} from "../../hooks/useUserBands";

import {
    bootstrapSync,
} from "../../services/sync/BootstrapSyncService";

type AppMenuProps = {
    onClose: () => void;
};

export function AppMenu({ onClose }: AppMenuProps) {
    const queryClient = useQueryClient();

    const [isSyncing, setIsSyncing] =
        useState(false);

    const handleBootstrapSync = async () => {
        if (isSyncing) return;

        setIsSyncing(true);

        try {
            console.log("Starting bootstrap sync...");

            await bootstrapSync();

            console.log("Bootstrap sync complete.");

            await queryClient.invalidateQueries();

            Alert.alert(
                "Sync complete",
                "Local data updated successfully."
            );
        } catch (error) {
            console.error(
                "Bootstrap sync failed:",
                error
            );

            Alert.alert(
                "Sync failed",
                error instanceof Error
                    ? error.message
                    : "Unable to update local data."
            );
        } finally {
            setIsSyncing(false);
        }
    };

    const {
        data: myBands = [],
    } = useMyBands();

    const myBand =
        myBands.length === 1
            ? myBands[0]
            : null;

    const goTo = (
        path:
            | "/"
            | "/bands"
            | "/venues"
            | "/gigs"
            | "/pr"
            | "/export"
    ) => {
        onClose();
        router.push(path);
    };

    return (
        <View style={styles.menu}>
            <MenuItem
                title="Home"
                description="SupportScout dashboard"
                onPress={() => goTo("/")}
            />

            <MenuItem
                title={
                    myBands.length > 1
                        ? "My Bands"
                        : "My Band"
                }
                description={
                    myBand
                        ? myBand.bandName
                        : myBands.length > 1
                            ? "Manage your bands"
                            : "Choose your band"
                }
                onPress={() => {
                    onClose();

                    if (myBand) {
                        router.push(
                            `/bands/${myBand.bandId}`
                        );
                        return;
                    }

                    router.push(
                        "/settings/bands"
                    );
                }}
            />

            <MenuItem
                title="Bands"
                description="Search and explore artists"
                onPress={() => goTo("/bands")}
            />

            <MenuItem
                title="Venues"
                description="Research Perth venues"
                onPress={() => goTo("/venues")}
            />

            <MenuItem
                title="Gigs"
                description="Track upcoming and past shows"
                onPress={() => goTo("/gigs")}
            />

            <MenuItem
                title="Lineups"
                description="Build and save show lineups"
                disabled
            />

            <MenuItem
                title="Rankings"
                description="Compare lineup compatibility"
                disabled
            />


            {Platform.OS === "web" && (
                <MenuItem
                    title="PR Contacts"
                    description="Manage PR contacts"
                    onPress={() => goTo("/pr")}
                />
            )}

            {Platform.OS !== "web" && (
                <MenuItem
                    title={
                        isSyncing
                            ? "Syncing Data..."
                            : "Sync Data Now"
                    }
                    description={
                        isSyncing
                            ? "Updating local database"
                            : "Sync main server data to device"
                    }
                    onPress={handleBootstrapSync}
                />
            )}
        </View>
    );
}