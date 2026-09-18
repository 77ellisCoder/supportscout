import {
    Pool,
} from "pg";

const connectionString =
    process.env.NEON_DATABASE_URL_POOLED ??
    process.env.NEON_DATABASE_URL ??
    process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error(
        "Database connection URL is not set"
    );
}

export const pool =
    new Pool({
        connectionString,
    });