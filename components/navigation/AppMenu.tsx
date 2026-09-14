import { router } from "expo-router";
import { Platform, View } from "react-native";

import { MenuItem } from "./MenuItem";
import { styles } from "./AppMenu.styles";

import {
    bootstrapSync,
} from "../../services/sync/BootstrapSyncService";

type AppMenuProps = {
    onClose: () => void;
};

export function AppMenu({ onClose }: AppMenuProps) {
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
                title="Bands"
                description="Search and explore artists"
                onPress={() => goTo("/bands")}
            />

            <MenuItem
                title="Rankings"
                description="Compare lineup compatibility"
                disabled
            />

            <MenuItem
                title="Venues"
                description="Research Perth venues"
                onPress={() => goTo("/venues")}
            />

            <MenuItem
                title="Lineups"
                description="Build and save show lineups"
                disabled
            />

            <MenuItem
                title="Gigs"
                description="Track upcoming and past shows"
                onPress={() => goTo("/gigs")}
            />

            {Platform.OS === "web" && (
                <MenuItem
                    title="PR Contacts"
                    description="Manage PR contacts"
                    onPress={() => goTo("/pr")}
                />
            )}

            {/*
            //TODO: potentially reimplement later
            <MenuItem
                title="Export"
                description="Export data to CSV"
                onPress={() => goTo("/export")}
            />
            */}

            <MenuItem
                title="Sync Data Now"
                description="Sync main server data to device"
                onPress={
                    handleBootstrapSync
                }
            />
        </View>
    );
}

import {
    getDatabase,
} from "../../database/sqlite/Database";

async function handleBootstrapSync() {
    try {
        console.log(
            "Starting bootstrap sync..."
        );

        await bootstrapSync();

        const db =
            await getDatabase();

        const users =
            await db.getAllAsync(
                `
        SELECT
            user_id,
            email,
            display_name
        FROM users
        ORDER BY user_id
        `
            );

        const locations =
            await db.getAllAsync(
                `
        SELECT
            rehearsal_location_id,
            name,
            active
        FROM rehearsal_locations
        ORDER BY rehearsal_location_id
        `
            );

        const proposals =
            await db.getAllAsync(
                `
        SELECT
            proposal_id,
            band_id,
            rehearsal_location_id,
            location,
            notes,
            status
        FROM rehearsal_proposals
        ORDER BY proposal_id
        `
            );

        console.log(
            "SYNC users:",
            users
        );

        console.log(
            "SYNC locations:",
            locations
        );

        console.log(
            "SYNC proposals:",
            proposals
        );

        console.log(
            "Bootstrap sync complete."
        );
    } catch (error) {
        console.error(
            "Bootstrap sync failed:",
            error
        );
    }
}