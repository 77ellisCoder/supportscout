import {
    AuthStorage,
} from "../storage/AuthStorage";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:3001";

export type RehearsalLocation = {
    rehearsalLocationId: number;

    name: string;

    address: string | null;

    suburb: string | null;

    state: string;

    postcode: string | null;

    phone: string | null;

    email: string | null;

    website: string | null;

    bookingUrl: string | null;

    defaultSessionMinutes:
    number | null;

    indicativeRate:
    number | null;

    notes: string | null;

    isFavourite: boolean;

    bandNotes: string | null;
};

export async function getRehearsalLocations(
    bandId: number
): Promise<RehearsalLocation[]> {
    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "You must be signed in."
        );
    }

    const response =
        await fetch(
            `${API_URL}/rehearsal-locations?bandId=${bandId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    const body =
        await response.json();

    if (!response.ok) {
        throw new Error(
            body?.error ??
            "Unable to load rehearsal locations"
        );
    }

    return body;
}