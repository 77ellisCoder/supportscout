import {
    AuthStorage,
} from "../storage/AuthStorage";

import {
    API_URL,
} from "../../config/api";

export type RehearsalProposal = {
    proposalId: number;
    bandId: number;
    proposedByUserId: number;
    rehearsalLocationId: number | null;
    startAt: string;
    endAt: string;
    location: string | null;
    notes: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateRehearsalProposalInput = {
    bandId: number;
    startAt: string;
    endAt: string;
    rehearsalLocationId?: number | null;
    location?: string | null;
    notes?: string | null;
};

export async function createRehearsalProposal(
    input: CreateRehearsalProposalInput
): Promise<RehearsalProposal> {
    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "You must be signed in."
        );
    }

    const response =
        await fetch(
            `${API_URL}/rehearsal-proposals`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body:
                    JSON.stringify(input),
            }
        );

    const body =
        await response.json();

    if (!response.ok) {
        throw new Error(
            body?.error ??
            "Unable to create rehearsal proposal"
        );
    }

    return body;
}