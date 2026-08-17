export type VenueStatus =
    | "active"
    | "inactive"
    | "closed"
    | "unknown";

export type Venue = {
    venueId: number;
    venueName: string;
    slug: string | null;

    suburb: string | null;
    stateRegion: string;
    countryCode: string;

    address: string | null;

    capacity: number | null;
    venueType: string | null;

    websiteUrl: string | null;
    bookingUrl: string | null;
    bookingEmail: string | null;

    shortDescription: string | null;
    internalNotes: string | null;

    status: VenueStatus;
    isVerified: boolean;

    hometown: string | null;
};