import * as SQLite from "expo-sqlite";

import { runMigrations } from "./migrations";
import { logger } from "../../utils/logger"

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function initialiseDatabase(): Promise<SQLite.SQLiteDatabase> {
  logger.debug("Opening SupportScout database...");

  const db = await SQLite.openDatabaseAsync(
    "supportscout.sqlite"
  );

  logger.debug("Database opened.");

  logger.debug("Configuring SQLite...");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
  `);

  logger.debug("SQLite configured.");

  try {
    logger.debug("Running migrations...");

    await runMigrations(db);

    logger.debug("Migrations complete.");
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