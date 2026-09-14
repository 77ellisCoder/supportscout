import {
    getDatabase,
    resetDatabaseConnection,
} from "../../database/sqlite/Database";

async function clearData(): Promise<void> {
    const db =
        await getDatabase();

    await db.withTransactionAsync(
        async () => {
            await db.runAsync(`
                DELETE FROM rehearsal_proposals
            `);

            await db.runAsync(`
                DELETE FROM band_rehearsal_locations
            `);

            await db.runAsync(`
                DELETE FROM user_bands
            `);

            await db.runAsync(`
                DELETE FROM rehearsal_locations
            `);

            await db.runAsync(`
                DELETE FROM users
            `);

            await db.runAsync(`
                DELETE FROM sync_metadata
            `);
        }
    );
}

export async function clearUserScopedData():
    Promise<void> {

    console.log(
        "Clearing user-scoped SQLite data..."
    );

    try {
        await clearData();
    } catch (
        error
    ) {
        const message =
            error instanceof Error
                ? error.message
                : String(error);

        if (
            message.includes(
                "Invalid VFS state"
            )
        ) {
            console.warn(
                "SQLite VFS was stale. Reopening database..."
            );

            await resetDatabaseConnection();

            await clearData();
        } else {
            throw error;
        }
    }

    console.log(
        "User-scoped SQLite data cleared."
    );
}