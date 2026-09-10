import type { Venue } from "../../models/Venue";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

type VenueInput = {
    venueName: string;
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
    status: Venue["status"];
    isVerified: boolean;
};

async function parseResponse<T>(
    response: Response
): Promise<T> {
    if (!response.ok) {
        const text = await response.text();

        throw new Error(
            text ||
                `Request failed with status ${response.status}`
        );
    }

    return response.json() as Promise<T>;
}

export const VenueRepository = {
    async getAll(): Promise<Venue[]> {
        const response = await fetch(
            `${API_URL}/venues`
        );

        return parseResponse<Venue[]>(
            response
        );
    },

    async getById(
        id: number
    ): Promise<Venue | null> {
        const response = await fetch(
            `${API_URL}/venues/${id}`
        );

        if (response.status === 404) {
            return null;
        }

        return parseResponse<Venue>(
            response
        );
    },

    async create(
        venue: VenueInput
    ): Promise<number> {
        const response = await fetch(
            `${API_URL}/venues`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(
                    venue
                ),
            }
        );

        const result =
            await parseResponse<{
                venueId: number;
            }>(response);

        return result.venueId;
    },

    async update(
        id: number,
        venue: Partial<VenueInput>
    ): Promise<void> {
        const response = await fetch(
            `${API_URL}/venues/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(
                    venue
                ),
            }
        );

        await parseResponse<{
            success: boolean;
        }>(response);
    },
};