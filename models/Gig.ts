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
    createdAt: string;
    updatedAt: string;
};

export type GigListItem = Gig & {
    venueName: string | null;
    suburb: string | null;
    bandCount: number;
};