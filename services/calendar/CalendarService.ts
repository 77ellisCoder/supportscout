import { Linking } from "react-native";

import {
    API_URL,
} from "../../config/environment";

import {
    AuthStorage,
} from "../storage/AuthStorage";

export type AvailabilityWindow = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

export type AvailabilityPreferences = {
    userId: number;
    minimumMinutes: number;
    bufferMinutes: number;
    timezone: string;
    windows: AvailabilityWindow[];
};


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

export async function startGoogleCalendarConnection() {
    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "Authentication required."
        );
    }

    const response = await fetch(
        `${API_URL}/calendar/google/connect`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            "Unable to start Google Calendar connection."
        );
    }

    const {
        url,
    } = await response.json();

    await Linking.openURL(
        url
    );
}

export type CalendarProvider =
    "google" |
    "icloud";

export type CalendarConnection = {
    provider:
        CalendarProvider;

    email:
        string | null;

    timezone:
        string;

    updatedAt:
        string;
};

export async function getCalendarConnections():
    Promise<CalendarConnection[]> {

    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "Authentication required."
        );
    }

    const response =
        await fetch(
            `${API_URL}/calendar/connections`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    if (!response.ok) {
        throw new Error(
            "Unable to load calendar connections."
        );
    }

    const body =
        await response.json();

    return body.connections;
}

export async function connectICloudCalendar(
    email: string,
    appSpecificPassword: string
) {
    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "Authentication required."
        );
    }

    const response =
        await fetch(
            `${API_URL}/calendar/icloud/connect`,
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body:
                    JSON.stringify({
                        email,
                        appSpecificPassword,
                    }),
            }
        );

    const body =
        await response
            .json()
            .catch(
                () => ({})
            );

    if (!response.ok) {
        throw new Error(
            body.error ??
                "Unable to connect iCloud Calendar."
        );
    }

    return body;
}

export async function disconnectCalendar(
    provider: CalendarProvider
) {
    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "Authentication required."
        );
    }

    const response =
        await fetch(
            `${API_URL}/calendar/connections/${provider}`,
            {
                method:
                    "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    if (!response.ok) {
        throw new Error(
            "Unable to disconnect calendar."
        );
    }
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

export async function getAvailabilityPreferences(
    userId: number
): Promise<AvailabilityPreferences> {
    const response = await fetch(
        `${API_URL}/calendar/users/${userId}/preferences`
    );

    if (!response.ok) {
        throw new Error(
            "Unable to load availability preferences"
        );
    }

    return response.json();
}

export async function saveAvailabilityPreferences(
    userId: number,
    preferences: Omit<
        AvailabilityPreferences,
        "userId"
    >
): Promise<AvailabilityPreferences> {
    const response = await fetch(
        `${API_URL}/calendar/users/${userId}/preferences`,
        {
            method: "PUT",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify(
                preferences
            ),
        }
    );

    if (!response.ok) {
        const body =
            await response.json();

        throw new Error(
            body?.error ??
            "Unable to save availability preferences"
        );
    }

    return response.json();
}
