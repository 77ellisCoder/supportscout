import type { SQLiteDatabase } from "expo-sqlite";

export const migration005 = {
    version: 5,
    name: "add_band_contact_fields",

    async up(db: SQLiteDatabase): Promise<void> {
        await db.execAsync(`
            ALTER TABLE bands
                ADD COLUMN booking_contact_name TEXT;

            ALTER TABLE bands
                ADD COLUMN contact_email TEXT;

            ALTER TABLE bands
                ADD COLUMN facebook_url TEXT;

            ALTER TABLE bands
                ADD COLUMN instagram_url TEXT;

            ALTER TABLE bands
                ADD COLUMN website_url TEXT;
        `);
    },
};