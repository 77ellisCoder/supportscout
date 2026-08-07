import * as SQLite from "expo-sqlite";
import { runMigrations } from "./migrations";

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("supportscout.sqlite");
  }

  const db = await databasePromise;
  await runMigrations(db);
  return db;
}
