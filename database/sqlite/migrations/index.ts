import type { SQLiteDatabase } from "expo-sqlite";

import { migration001 } from "./001_initial";
import { migration002 } from "./002_venues";

type Migration = {
  version: number;
  name: string;
  up: (database: SQLiteDatabase) => Promise<void>;
};

const migrations: Migration[] = [
  migration001,
  migration002
];

export async function runMigrations(
  database: SQLiteDatabase
): Promise<void> {
  console.log("Ensuring schema_migrations exists...");

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Reading applied migrations...");

  const applied = await database.getAllAsync<{
    version: number;
  }>(
    "SELECT version FROM schema_migrations"
  );

  const appliedVersions = new Set(
    applied.map((migration) => migration.version)
  );

  for (const migration of migrations) {
    console.log(
      `Checking migration ${migration.version}: ${migration.name}`
    );

    if (appliedVersions.has(migration.version)) {
      console.log(
        `Migration ${migration.version} already applied`
      );

      continue;
    }

    console.log(
      `Applying migration ${migration.version}: ${migration.name}`
    );

    try {
      await database.withTransactionAsync(async () => {
        await migration.up(database);

        await database.runAsync(
          `
            INSERT INTO schema_migrations (
              version,
              name
            )
            VALUES (?, ?)
          `,
          migration.version,
          migration.name
        );
      });

      console.log(
        `Migration ${migration.version} completed`
      );
    } catch (error) {
      console.error(
        `Migration ${migration.version} FAILED:`,
        error
      );

      throw error;
    }
  }
}