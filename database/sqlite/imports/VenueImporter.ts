import { getDatabase } from "../Database";

const venues = require("../../../assets/imports/venues.json");

type SeedVenue = {
    venueName: string;
    slug?: string;
    suburb?: string;
    address?: string;
    venueType?: string;
    websiteUrl?: string;
    bookingUrl?: string;
    bookingEmail?: string;
    shortDescription?: string;
    status?: string;
    isVerified?: boolean;
};

export async function importVenues(): Promise<number> {
    const db = await getDatabase();

    let imported = 0;

    for (const venue of venues as SeedVenue[]) {
        const result = await db.runAsync(
            `
        INSERT OR IGNORE INTO venues (
          venue_name,
          slug,
          suburb,
          address,
          venue_type,
          website_url,
          booking_url,
          booking_email,
          short_description,
          status,
          is_verified
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            venue.venueName,
            venue.slug ?? null,
            venue.suburb ?? null,
            venue.address ?? null,
            venue.venueType ?? null,
            venue.websiteUrl ?? null,
            venue.bookingUrl ?? null,
            venue.bookingEmail ?? null,
            venue.shortDescription ?? null,
            venue.status ?? "active",
            venue.isVerified ? 1 : 0
        );

        if (result.changes > 0) {
            imported++;
        }
    }

    console.log(`Imported ${imported} venues`);

    return imported;
}