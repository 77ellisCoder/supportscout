import type { SQLiteDatabase } from "expo-sqlite";

import { migration001 } from "./001_initial";

type Migration = {
  version: number;
  name: string;
  up: (database: SQLiteDatabase) => Promise<void>;
};

const migrations: Migration[] = [
  migration001,
];

export async function runMigrations(
  database: SQLiteDatabase
): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const applied = await database.getAllAsync<{
    version: number;
  }>("SELECT version FROM schema_migrations");

  const appliedVersions = new Set(
    applied.map((migration) => migration.version)
  );

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }

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
  }
}