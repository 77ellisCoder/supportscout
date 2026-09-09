import type { Band } from "../models/Band";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:3001";

type ApiGenre = {
    genreId: number | string;
    genreName: string;
};

type ApiBand = {
    bandId: number | string;
    bandName: string;
    slug: string | null;
    hometown: string | null;
    stateRegion: string | null;
    countryCode: string | null;
    memberCount: number | null;
    formationYear: number | null;
    status: Band["status"];
    shortDescription: string | null;

    // Not currently returned by GET /bands.
    internalNotes?: string | null;

    isOurBand: boolean;
    isVerified: boolean;

    bookingContactName?: string | null;
    contactEmail?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    websiteUrl?: string | null;

    createdAt?: string;
    updatedAt?: string;
    archivedAt?: string | null;

    genres?: ApiGenre[];
};

function mapBand(row: ApiBand): Band {
    return {
        bandId: Number(row.bandId),
        bandName: row.bandName,
        slug: row.slug,
        hometown: row.hometown,
        stateRegion: row.stateRegion,
        countryCode: row.countryCode,
        memberCount: row.memberCount,
        formationYear: row.formationYear,
        status: row.status,
        shortDescription: row.shortDescription,
        internalNotes: row.internalNotes ?? null,
        isOurBand: row.isOurBand,
        isVerified: row.isVerified,
        createdAt: row.createdAt ?? "",
        updatedAt: row.updatedAt ?? "",
        archivedAt: row.archivedAt ?? null,
        bookingContactName:
            row.bookingContactName ?? null,
        contactEmail:
            row.contactEmail ?? null,
        facebookUrl:
            row.facebookUrl ?? null,
        instagramUrl:
            row.instagramUrl ?? null,
        websiteUrl:
            row.websiteUrl ?? null,

        genres:
            row.genres?.map((genre) => ({
                id: Number(genre.genreId),
                name: genre.genreName,
            })) ?? [],
    };
}

export const WebBandRepository = {
    async getAll(search?: string): Promise<Band[]> {
        const response = await fetch(
            `${API_URL}/bands`
        );

        if (!response.ok) {
            throw new Error(
                `Unable to load bands (${response.status})`
            );
        }

        const rows: ApiBand[] =
            await response.json();

        const bands = rows.map(mapBand);

        const query = search
            ?.trim()
            .toLowerCase();

        if (!query) {
            return bands;
        }

        return bands.filter((band) =>
            band.bandName
                .toLowerCase()
                .includes(query)
        );
    },

    async getById(bandId: number): Promise<Band | null> {
        const response = await fetch(
            `${API_URL}/bands/${bandId}`
        );

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(
                `Unable to load band (${response.status})`
            );
        }

        const row: ApiBand =
            await response.json();

        return mapBand(row);
    },
};