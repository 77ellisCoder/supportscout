import * as SQLite from "expo-sqlite";

import { runMigrations } from "./migrations";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function initialiseDatabase(): Promise<SQLite.SQLiteDatabase> {
  console.log("Opening SupportScout database...");

  const db = await SQLite.openDatabaseAsync(
    "supportscout.sqlite"
  );

  console.log("Database opened.");

  console.log("Configuring SQLite...");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  console.log("SQLite configured.");

  try {
    console.log("Running migrations...");

    await runMigrations(db);

    console.log("Migrations complete.");
  } catch (error) {
    console.error(
      "Database migration failed:",
      error
    );

    throw error;
  }

  return db;
}

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = initialiseDatabase().catch(
      (error) => {
        databasePromise = null;
        throw error;
      }
    );
  }

  return databasePromise;
}