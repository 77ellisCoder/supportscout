import { getDatabase } from "../database/sqlite/Database";
import { importSupportBands } from "../database/sqlite/imports/SpreadsheetImporter";
import { importVenues } from "../database/sqlite/imports/VenueImporter";

class AppBootstrapServiceClass {
    private started = false;

    async initialise(): Promise<void> {
        if (this.started) {
            return;
        }

        this.started = true;

        try {
            console.log("Initialising SupportScout database...");

            const db = await getDatabase();

            const result = await db.getFirstAsync<{ count: number }>(
                "SELECT COUNT(*) AS count FROM bands"
            );

            const bandCount = result?.count ?? 0;

            console.log("Existing bands:", bandCount);

            if (bandCount === 0) {
                console.log("Fresh database detected. Importing bundled band data...");

                const importResult = await importSupportBands();

                console.log("Initial band import complete:", importResult);
            }

            const venueResult = await db.getFirstAsync<{
                count: number;
            }>(
                "SELECT COUNT(*) AS count FROM venues"
            );

            const venueCount = venueResult?.count ?? 0;

            console.log("Existing venues:", venueCount);

            if (venueCount === 0) {
                console.log(
                    "No venues found. Importing bundled venue data..."
                );

                await importVenues();
            }

            console.log("SupportScout database ready.");
        } catch (error) {
            this.started = false;
            console.error("SupportScout bootstrap failed:", error);
            throw error;
        }
    }
}

export const AppBootstrapService =
    new AppBootstrapServiceClass();