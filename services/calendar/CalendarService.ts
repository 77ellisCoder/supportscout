import { Linking } from "react-native";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:3001";

export type AvailabilityInterval = {
    start: string;
    end: string;
};

export type CalendarStatus = {
    connected: boolean;
    provider: string | null;
    email: string | null;
    timezone: string;
};

export type BandAvailabilityMember = {
    userId: number;
    displayName: string | null;
    email: string;
    relationship: string;

    connected: boolean;

    providers: string[];

    timezone: string;

    busy: AvailabilityInterval[];

    available: AvailabilityInterval[];
};

export type AvailabilityResponse = {
    bandId: number;

    from: string;
    to: string;

    memberCount?: number;
    connectedMemberCount?: number;

    members: BandAvailabilityMember[];

    sharedAvailable: AvailabilityInterval[];
};

export async function startGoogleCalendarConnection(
    userId: number
) {
    const response = await fetch(
        `${API_URL}/calendar/google/connect?userId=${encodeURIComponent(
            userId
        )}`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to start Google Calendar connection."
        );
    }

    const { url } =
        await response.json();

    await Linking.openURL(url);
}

export async function getCalendarStatus(
    bandId: number
): Promise<CalendarStatus> {
    const response = await fetch(
        `${API_URL}/calendar/bands/${bandId}/status`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to load calendar status."
        );
    }

    return response.json();
}

export async function getBandAvailability(
    bandId: number,
    from: Date,
    to: Date
): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString(),
    });

    const response = await fetch(
        `${API_URL}/calendar/bands/${bandId}/availability?${params}`
    );

    if (!response.ok) {
        const body =
            await response.json().catch(
                () => ({})
            );

        throw new Error(
            body.error ??
                "Unable to calculate availability."
        );
    }

    return response.json();
}
