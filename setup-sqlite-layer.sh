#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
mkdir -p "$ROOT/database/migrations" "$ROOT/models" "$ROOT/repositories"

cat > "$ROOT/database/migrations/001_initial.ts" <<'EOF'
import type { SQLiteDatabase } from "expo-sqlite";

export const migration001 = {
  version: 1,
  name: "initial_schema",

  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bands (
        band_id INTEGER PRIMARY KEY AUTOINCREMENT,
        band_name TEXT NOT NULL COLLATE NOCASE,
        slug TEXT,
        hometown TEXT DEFAULT 'Perth',
        state_region TEXT DEFAULT 'Western Australia',
        country_code TEXT DEFAULT 'AU',
        member_count INTEGER,
        formation_year INTEGER,
        status TEXT NOT NULL DEFAULT 'active'
          CHECK (status IN ('active', 'inactive', 'hiatus', 'unknown')),
        short_description TEXT,
        internal_notes TEXT,
        is_our_band INTEGER NOT NULL DEFAULT 0 CHECK (is_our_band IN (0, 1)),
        is_verified INTEGER NOT NULL DEFAULT 0 CHECK (is_verified IN (0, 1)),
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        archived_at TEXT
      );

      CREATE UNIQUE INDEX IF NOT EXISTS uq_bands_name_active
      ON bands (band_name)
      WHERE archived_at IS NULL;
    `);
  },
};
EOF

cat > "$ROOT/database/migrations/index.ts" <<'EOF'
import type { SQLiteDatabase } from "expo-sqlite";
import { migration001 } from "./001_initial";

const migrations = [migration001];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const applied = await db.getAllAsync<{ version: number }>(
    "SELECT version FROM schema_migrations"
  );
  const appliedVersions = new Set(applied.map((row) => row.version));

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;

    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await db.runAsync(
        "INSERT INTO schema_migrations (version, name) VALUES (?, ?)",
        migration.version,
        migration.name
      );
    });
  }
}
EOF

cat > "$ROOT/database/database.ts" <<'EOF'
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
EOF

cat > "$ROOT/models/Band.ts" <<'EOF'
export type BandStatus = "active" | "inactive" | "hiatus" | "unknown";

export type Band = {
  bandId: number;
  bandName: string;
  slug: string | null;
  hometown: string | null;
  stateRegion: string | null;
  countryCode: string | null;
  memberCount: number | null;
  formationYear: number | null;
  status: BandStatus;
  shortDescription: string | null;
  internalNotes: string | null;
  isOurBand: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type CreateBandInput = {
  bandName: string;
  slug?: string | null;
  hometown?: string | null;
  stateRegion?: string | null;
  countryCode?: string | null;
  memberCount?: number | null;
  formationYear?: number | null;
  status?: BandStatus;
  shortDescription?: string | null;
  internalNotes?: string | null;
  isOurBand?: boolean;
  isVerified?: boolean;
};
EOF

cat > "$ROOT/repositories/BandRepository.ts" <<'EOF'
import { getDatabase } from "../database/database";
import type { Band, BandStatus, CreateBandInput } from "../models/Band";

type BandRow = {
  band_id: number;
  band_name: string;
  slug: string | null;
  hometown: string | null;
  state_region: string | null;
  country_code: string | null;
  member_count: number | null;
  formation_year: number | null;
  status: BandStatus;
  short_description: string | null;
  internal_notes: string | null;
  is_our_band: number;
  is_verified: number;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

function mapBand(row: BandRow): Band {
  return {
    bandId: row.band_id,
    bandName: row.band_name,
    slug: row.slug,
    hometown: row.hometown,
    stateRegion: row.state_region,
    countryCode: row.country_code,
    memberCount: row.member_count,
    formationYear: row.formation_year,
    status: row.status,
    shortDescription: row.short_description,
    internalNotes: row.internal_notes,
    isOurBand: row.is_our_band === 1,
    isVerified: row.is_verified === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const BandRepository = {
  async getAll(): Promise<Band[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<BandRow>(`
      SELECT *
      FROM bands
      WHERE archived_at IS NULL
      ORDER BY band_name COLLATE NOCASE
    `);

    return rows.map(mapBand);
  },

  async getById(bandId: number): Promise<Band | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<BandRow>(
      "SELECT * FROM bands WHERE band_id = ?",
      bandId
    );

    return row ? mapBand(row) : null;
  },

  async create(input: CreateBandInput): Promise<Band> {
    const bandName = input.bandName.trim();
    if (!bandName) throw new Error("Band name is required.");

    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO bands (
        band_name, slug, hometown, state_region, country_code,
        member_count, formation_year, status, short_description,
        internal_notes, is_our_band, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      bandName,
      input.slug ?? slugify(bandName),
      input.hometown ?? "Perth",
      input.stateRegion ?? "Western Australia",
      input.countryCode ?? "AU",
      input.memberCount ?? null,
      input.formationYear ?? null,
      input.status ?? "active",
      input.shortDescription ?? null,
      input.internalNotes ?? null,
      input.isOurBand ? 1 : 0,
      input.isVerified ? 1 : 0
    );

    const created = await this.getById(result.lastInsertRowId);
    if (!created) throw new Error("Unable to reload created band.");
    return created;
  },

  async archive(bandId: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE bands
       SET archived_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE band_id = ?`,
      bandId
    );
  },
};
EOF

echo "SupportScout SQLite layer created."
echo "Run: npx expo start --clear"
