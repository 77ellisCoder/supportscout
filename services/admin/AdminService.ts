import { API_URL } from "../../config/environment";
import { AuthStorage } from "../storage/AuthStorage";
import { expectOk } from "../../utils/api";

export type AdminAccess = {
    systemAdmin: boolean;
    bandAdminIds: number[];
};

export type AdminUser = {
    userId: number;
    displayName: string | null;
    email: string;
    systemAdmin: boolean;
};

export type AdminBand = {
    bandId: number;
    bandName: string;
};

export type AdminBandMember = {
    userId: number;
    displayName: string | null;
    email: string;
    relationship: string;
    bandRole: "member" | "band_admin";
};

export type AvailableBandUser = {
    userId: number;
    displayName: string | null;
    email: string;
};

async function authorizedFetch(
    path: string,
    init?: RequestInit
): Promise<Response> {
    const token = await AuthStorage.getToken();

    if (!token) {
        throw new Error("Authentication required");
    }

    return fetch(`${API_URL}/admin${path}`, {
        ...init,
        headers: {
            ...(init?.body ? { "Content-Type": "application/json" } : {}),
            ...init?.headers,
            Authorization: `Bearer ${token}`,
        },
    });
}

async function fetchJson<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const response = await authorizedFetch(path, init);
    await expectOk(response, `Admin request failed (${response.status})`);
    return response.json() as Promise<T>;
}

export const AdminService = {
    getAccess(): Promise<AdminAccess> {
        return fetchJson("/me");
    },

    getUsers(): Promise<AdminUser[]> {
        return fetchJson("/users");
    },

    setSystemAdmin(
        userId: number,
        enabled: boolean
    ): Promise<{ userId: number; systemAdmin: boolean }> {
        return fetchJson(`/users/${userId}/system-admin`, {
            method: "PUT",
            body: JSON.stringify({ enabled }),
        });
    },

    getBands(): Promise<AdminBand[]> {
        return fetchJson("/bands");
    },

    getBandMembers(bandId: number): Promise<AdminBandMember[]> {
        return fetchJson(`/bands/${bandId}/members`);
    },

    getAvailableBandUsers(
        bandId: number,
        search: string
    ): Promise<AvailableBandUser[]> {
        const params = new URLSearchParams({ search });
        return fetchJson(
            `/bands/${bandId}/available-users?${params.toString()}`
        );
    },

    addBandMember(
        bandId: number,
        userId: number
    ): Promise<void> {
        return authorizedFetch(`/bands/${bandId}/members`, {
            method: "POST",
            body: JSON.stringify({ userId, bandRole: "member" }),
        }).then((response) =>
            expectOk(response, `Unable to add member (${response.status})`)
        );
    },

    setBandRole(
        bandId: number,
        userId: number,
        bandRole: AdminBandMember["bandRole"]
    ): Promise<{ userId: number; bandId: number; bandRole: string }> {
        return fetchJson(`/bands/${bandId}/members/${userId}/role`, {
            method: "PATCH",
            body: JSON.stringify({ bandRole }),
        });
    },

    async removeBandMember(
        bandId: number,
        userId: number
    ): Promise<void> {
        const response = await authorizedFetch(
            `/bands/${bandId}/members/${userId}`,
            { method: "DELETE" }
        );
        await expectOk(response, `Unable to remove member (${response.status})`);
    },
};