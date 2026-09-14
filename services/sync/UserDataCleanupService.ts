import {
    getDatabase,
} from "../../database/sqlite/Database";

export async function clearUserScopedData(): Promise<void> {
    const db =
        await getDatabase();

    console.log(
        "Clearing user-scoped SQLite data..."
    );

    await db.withTransactionAsync(
        async () => {
            /*
             * Delete child records first so
             * foreign-key constraints remain happy.
             */

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

            /*
             * Sync metadata belongs to the
             * authenticated session/snapshot.
             */

            await db.runAsync(`
                DELETE FROM sync_metadata
            `);
        }
    );

    console.log(
        "User-scoped SQLite data cleared."
    );
}