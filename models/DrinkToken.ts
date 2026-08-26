/**
 * This file defines the DrinkToken type, which represents a token that can be used to redeem a drink at a gig. Each token is associated with a specific gig and band, and has a unique token ID. The token can be marked as used, and the date and time of use can be recorded.
 *
 * The DrinkToken type is used in the application to manage drink tokens for gigs and bands. It is defined as a TypeScript type, which allows for type checking and better code quality.
 *
 * The DrinkToken type has the following properties:
 * - tokenId: A unique identifier for the drink token (number).
 * - gigId: The ID of the gig associated with the drink token (number).
 * - bandId: The ID of the band associated with the drink token (number).
 * - used: A boolean indicating whether the drink token has been used (boolean).
 * - usedAt: The date and time when the drink token was used, or null if it has not been used (string | null).
 *
 * This file is part of the database/sqlite/migrations directory, which contains migration scripts for managing the database schema. The DrinkToken type is related to the migration that creates the gig_band_drink_tokens table in the database.
 */

export type DrinkToken = {
    tokenId: number;
    gigId: number;
    bandId: number;
    used: boolean;
    usedAt: string | null;
};