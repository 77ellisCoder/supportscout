import * as SQLite from "expo-sqlite";
let database: SQLite.SQLiteDatabase | null = null;
export async function getDatabase() {
  if (!database) database = await SQLite.openDatabaseAsync("support-band-db.sqlite");
  return database;
}
export async function initialiseDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS app_metadata (
      metadata_key TEXT PRIMARY KEY NOT NULL,
      metadata_value TEXT
    );
  `);
}
