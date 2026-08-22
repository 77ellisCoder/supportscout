/**
 * This type represents a gig, including its ID, associated venue ID, date, event name, notes, status, associated band IDs, and timestamps for creation and last update.
 */

export type GigStatus =
    | "tentative"
    | "confirmed"
    | "completed"
    | "cancelled";

export type Gig = {
    gigId: number;
    venueId: number | null;
    gigDate: string;
    eventName: string | null;
    notes: string | null;
    status: GigStatus;
    bandIds: number[];
    createdAt: string;
    updatedAt: string;
};

export type GigListItem = {
    gigId: number;
    venueId: number | null;
    gigDate: string;
    eventName: string | null;
    notes: string | null;
    status: GigStatus;

    venueName: string | null;
    suburb: string | null;
    bandCount: number;

    createdAt: string;
    updatedAt: string;
};

export type GigBand = {
    bandId: number;
    bandName: string;
    billingOrder: number | null;
    role: string | null;
};

export type GigDetail = Gig & {
    venueName: string | null;
    suburb: string | null;
    bands: GigBand[];
};