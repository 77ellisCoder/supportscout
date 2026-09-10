import { Platform } from "react-native";

import { getDatabase } from "../database/sqlite/Database";
import { importSupportBands } from "../database/sqlite/imports/SpreadsheetImporter";
import { importVenues } from "../database/sqlite/imports/VenueImporter";
import { logger } from "../utils/logger";

class AppBootstrapServiceClass {
    private started = false;

    async initialise(): Promise<void> {
        // Web uses the API/PostgreSQL.
        // SQLite bootstrap is only required for native platforms.
        if (Platform.OS === "web") {
            logger.debug(
                "Skipping SQLite bootstrap on Web."
            );
            return;
        }

        if (this.started) {
            return;
        }

        this.started = true;

        try {
            logger.debug(
                "Initialising SupportScout database..."
            );

            const db = await getDatabase();

            const result =
                await db.getFirstAsync<{
                    count: number;
                }>(
                    "SELECT COUNT(*) AS count FROM bands"
                );

            const bandCount =
                result?.count ?? 0;

            logger.debug(
                "Existing bands:",
                bandCount
            );

            if (bandCount === 0) {
                logger.info(
                    "Fresh database detected. Importing bundled band data..."
                );

                const importResult =
                    await importSupportBands();

                logger.debug(
                    "Initial band import complete:",
                    importResult
                );
            }

            const venueResult =
                await db.getFirstAsync<{
                    count: number;
                }>(
                    "SELECT COUNT(*) AS count FROM venues"
                );

            const venueCount =
                venueResult?.count ?? 0;

            logger.debug(
                "Existing venues:",
                venueCount
            );

            if (venueCount === 0) {
                logger.info(
                    "No venues found. Importing bundled venue data..."
                );

                await importVenues();
            }

            logger.debug(
                "SupportScout database ready."
            );
        } catch (error) {
            this.started = false;

            logger.error(
                "SupportScout bootstrap failed:",
                error
            );

            throw error;
        }
    }
}

export const AppBootstrapService = new AppBootstrapServiceClass();