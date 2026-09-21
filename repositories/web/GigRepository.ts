import type {
    Gig,
    GigDetail,
    GigListItem,
    GigStatus,
} from "../../models/Gig";

import {
    API_URL,
} from "../../config/environment";

type GigInput = {
    venueId: number | null;
    gigDate: string;
    eventName: string | null;
    notes: string | null;
    status: GigStatus;

    lineup: {
        bandId: number;
        role: string;
    }[];
};

async function readError(
    response: Response,
    fallback: string
): Promise<string> {
    try {
        const body =
            await response.json();

        console.log(
            "API ERROR RESPONSE:",
            response.status,
            body
        );

        if (
            body &&
            typeof body.error === "string"
        ) {
            return body.error;
        }
    } catch (
    error
    ) {
        console.log(
            "API ERROR BODY COULD NOT BE READ:",
            response.status,
            error
        );
    }

    return fallback;
}

export const GigRepository = {
    async getAll(): Promise<
        GigListItem[]
    > {
        const response = await fetch(
            `${API_URL}/gigs`
        );

        if (!response.ok) {
            throw new Error(
                await readError(
                    response,
                    "Unable to load gigs."
                )
            );
        }

        const gigs =
            (await response.json()) as GigListItem[];

        return gigs.map((gig) => ({
            ...gig,

            gigId: Number(gig.gigId),

            venueId:
                gig.venueId == null
                    ? null
                    : Number(gig.venueId),

            bandCount: Number(
                gig.bandCount ?? 0
            ),
        }));
    },

    async getById(
        gigId: number
    ): Promise<Gig | null> {
        const response = await fetch(
            `${API_URL}/gigs/${gigId}`
        );

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                `Failed to fetch gig ${gigId}`
            );
        }

        return response.json();
    },

    async getByBandId(
        bandId: number,
        period: "past" | "upcoming"
    ): Promise<GigListItem[]> {
        const response = await fetch(
            `${API_URL}/gigs/band/${bandId}?period=${period}`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch ${period} gigs for band ${bandId}`
            );
        }

        return response.json();
    },

    async getDetailById(
        gigId: number
    ): Promise<GigDetail | null> {
        const response = await fetch(
            `${API_URL}/gigs/${gigId}`
        );

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                await readError(
                    response,
                    "Unable to load gig."
                )
            );
        }

        const gig =
            (await response.json()) as GigDetail;

        return {
            ...gig,

            gigId: Number(gig.gigId),

            venueId:
                gig.venueId == null
                    ? null
                    : Number(gig.venueId),

            bandIds:
                gig.bandIds?.map(Number) ??
                [],

            bands:
                gig.bands?.map((band) => ({
                    ...band,

                    bandId: Number(
                        band.bandId
                    ),

                    billingOrder:
                        band.billingOrder ==
                            null
                            ? null
                            : Number(
                                band.billingOrder
                            ),

                    isOurBand: Boolean(
                        band.isOurBand
                    ),
                })) ?? [],
        };
    },

    async getByVenueId(
        venueId: number,
        period?: "past" | "upcoming"
    ): Promise<GigListItem[]> {
        const params =
            new URLSearchParams();

        if (period) {
            params.set("period", period);
        }

        const query =
            params.toString();

        const response = await fetch(
            `${API_URL}/gigs/venue/${venueId}${query ? `?${query}` : ""
            }`
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch gigs for venue ${venueId}`
            );
        }

        return response.json();
    },

    async create(
        input: GigInput
    ): Promise<Gig> {
        const response = await fetch(
            `${API_URL}/gigs`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify(input),
            }
        );

        if (!response.ok) {
            throw new Error(
                await readError(
                    response,
                    "Unable to create gig."
                )
            );
        }

        const gig =
            (await response.json()) as Gig;

        return {
            ...gig,

            gigId: Number(gig.gigId),

            venueId:
                gig.venueId == null
                    ? null
                    : Number(gig.venueId),

            bandIds:
                gig.bandIds?.map(Number) ??
                [],
        };
    },

    async update(
        gigId: number,
        input: GigInput
    ): Promise<void> {
        const response = await fetch(
            `${API_URL}/gigs/${gigId}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify(input),
            }
        );

        if (!response.ok) {
            throw new Error(
                await readError(
                    response,
                    "Unable to update gig."
                )
            );
        }
    },
};