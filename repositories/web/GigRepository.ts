import type {
    Gig,
    GigDetail,
    GigListItem,
    GigStatus,
} from "../../models/Gig";

import {
    API_URL,
} from "../../config/environment";

import {
    expectOk,
} from "../../utils/api";

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

function normaliseGigListItem(
    gig: GigListItem
): GigListItem {
    return {
        ...gig,

        gigId: Number(
            gig.gigId
        ),

        venueId:
            gig.venueId == null
                ? null
                : Number(
                    gig.venueId
                ),

        bandCount: Number(
            gig.bandCount ?? 0
        ),
    };
}

export const GigRepository = {
    async getAll(): Promise<
        GigListItem[]
    > {
        const response = await fetch(
            `${API_URL}/gigs`
        );

        await expectOk(
            response,
            "Unable to load gigs."
        );

        const gigs =
            (await response.json()) as GigListItem[];

        return gigs.map(
            normaliseGigListItem
        );
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

        await expectOk(
            response,
            `Failed to fetch gig ${gigId}`
        );

        return response.json();
    },

    async getByBandId(
        bandId: number,
        period: "past" | "upcoming"
    ): Promise<GigListItem[]> {
        const response = await fetch(
            `${API_URL}/gigs/band/${bandId}?period=${period}`
        );

        await expectOk(
            response,
            `Failed to fetch ${period} gigs for band ${bandId}`
        );

        const gigs =
            (await response.json()) as GigListItem[];

        return gigs.map(
            normaliseGigListItem
        );
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

        await expectOk(
            response,
            "Unable to load gig."
        );

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

        await expectOk(
            response,
            `Failed to fetch gigs for venue ${venueId}`
        );

        const gigs =
            (await response.json()) as GigListItem[];

        return gigs.map(
            normaliseGigListItem
        );
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

        await expectOk(
            response,
            "Unable to create gig."
        );

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

        await expectOk(
            response,
            "Unable to update gig."
        );
    },
};