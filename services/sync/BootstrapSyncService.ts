import {
    getDatabase,
} from "../../database/sqlite/Database";

import {
    AuthStorage,
} from "../storage/AuthStorage";

const API_URL =
    process.env.EXPO_PUBLIC_API_URL ??
    "http://localhost:3001";

type BootstrapSnapshot = {
    syncVersion: number;
    syncedAt: string;

    bands: any[];
    genres: any[];
    bandGenres: any[];

    venues: any[];

    gigs: any[];
    gigBands: any[];
    gigBandDrinkTokens: any[];

    users: any[];
    userBands: any[];

    rehearsalLocations: any[];
    bandRehearsalLocations: any[];
    rehearsalProposals: any[];
};

export async function bootstrapSync(): Promise<void> {
    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "Cannot sync without authentication."
        );
    }

    const response =
        await fetch(
            `${API_URL}/sync/bootstrap`,
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
            "Unable to bootstrap SupportScout"
        );
    }

    const snapshot =
        body as BootstrapSnapshot;

    const db =
        await getDatabase();

    await db.withTransactionAsync(
        async () => {

            /*
             * Bands
             */

            for (
                const band
                of snapshot.bands
            ) {
                await db.runAsync(
                    `
                    INSERT INTO bands (
                        band_id,
                        band_name,
                        slug,
                        hometown,
                        state_region,
                        country_code,
                        member_count,
                        formation_year,
                        status,
                        short_description,
                        internal_notes,
                        is_our_band,
                        is_verified,
                        created_at,
                        updated_at,
                        archived_at,
                        booking_contact_name,
                        contact_email,
                        facebook_url,
                        instagram_url,
                        website_url
                    )
                    VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?
                    )

                    ON CONFLICT(band_id)
                    DO UPDATE SET
                        band_name =
                            excluded.band_name,

                        slug =
                            excluded.slug,

                        hometown =
                            excluded.hometown,

                        state_region =
                            excluded.state_region,

                        country_code =
                            excluded.country_code,

                        member_count =
                            excluded.member_count,

                        formation_year =
                            excluded.formation_year,

                        status =
                            excluded.status,

                        short_description =
                            excluded.short_description,

                        internal_notes =
                            excluded.internal_notes,

                        is_our_band =
                            excluded.is_our_band,

                        is_verified =
                            excluded.is_verified,

                        created_at =
                            excluded.created_at,

                        updated_at =
                            excluded.updated_at,

                        archived_at =
                            excluded.archived_at,

                        booking_contact_name =
                            excluded.booking_contact_name,

                        contact_email =
                            excluded.contact_email,

                        facebook_url =
                            excluded.facebook_url,

                        instagram_url =
                            excluded.instagram_url,

                        website_url =
                            excluded.website_url
                    `,
                    band.bandId,
                    band.bandName,
                    band.slug,
                    band.hometown,
                    band.stateRegion,
                    band.countryCode,
                    band.memberCount,
                    band.formationYear,
                    band.status,
                    band.shortDescription,
                    band.internalNotes,
                    band.isOurBand
                        ? 1
                        : 0,
                    band.isVerified
                        ? 1
                        : 0,
                    band.createdAt,
                    band.updatedAt,
                    band.archivedAt,
                    band.bookingContactName,
                    band.contactEmail,
                    band.facebookUrl,
                    band.instagramUrl,
                    band.websiteUrl
                );
            }

            /*
             * Genres
             */

            for (
                const genre
                of snapshot.genres
            ) {
                await db.runAsync(
                    `
                    INSERT INTO genres (
                        genre_id,
                        genre_name,
                        created_at
                    )
                    VALUES (?, ?, ?)

                    ON CONFLICT(genre_id)
                    DO UPDATE SET
                        genre_name =
                            excluded.genre_name,

                        created_at =
                            excluded.created_at
                    `,
                    genre.genreId,
                    genre.genreName,
                    genre.createdAt
                );
            }

            /*
             * Band ↔ genres
             */

            for (
                const bandGenre
                of snapshot.bandGenres
            ) {
                await db.runAsync(
                    `
                    INSERT INTO band_genres (
                        band_id,
                        genre_id
                    )
                    VALUES (?, ?)

                    ON CONFLICT(
                        band_id,
                        genre_id
                    )
                    DO NOTHING
                    `,
                    bandGenre.bandId,
                    bandGenre.genreId
                );
            }

            /*
             * Venues
             */

            for (
                const venue
                of snapshot.venues
            ) {
                await db.runAsync(
                    `
                    INSERT INTO venues (
                        venue_id,
                        venue_name,
                        slug,
                        suburb,
                        state_region,
                        country_code,
                        address,
                        capacity,
                        venue_type,
                        website_url,
                        booking_url,
                        booking_email,
                        short_description,
                        internal_notes,
                        status,
                        is_verified,
                        created_at,
                        updated_at,
                        archived_at
                    )
                    VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?
                    )

                    ON CONFLICT(venue_id)
                    DO UPDATE SET
                        venue_name =
                            excluded.venue_name,

                        slug =
                            excluded.slug,

                        suburb =
                            excluded.suburb,

                        state_region =
                            excluded.state_region,

                        country_code =
                            excluded.country_code,

                        address =
                            excluded.address,

                        capacity =
                            excluded.capacity,

                        venue_type =
                            excluded.venue_type,

                        website_url =
                            excluded.website_url,

                        booking_url =
                            excluded.booking_url,

                        booking_email =
                            excluded.booking_email,

                        short_description =
                            excluded.short_description,

                        internal_notes =
                            excluded.internal_notes,

                        status =
                            excluded.status,

                        is_verified =
                            excluded.is_verified,

                        created_at =
                            excluded.created_at,

                        updated_at =
                            excluded.updated_at,

                        archived_at =
                            excluded.archived_at
                    `,
                    venue.venueId,
                    venue.venueName,
                    venue.slug,
                    venue.suburb,
                    venue.stateRegion,
                    venue.countryCode,
                    venue.address,
                    venue.capacity,
                    venue.venueType,
                    venue.websiteUrl,
                    venue.bookingUrl,
                    venue.bookingEmail,
                    venue.shortDescription,
                    venue.internalNotes,
                    venue.status,
                    venue.isVerified
                        ? 1
                        : 0,
                    venue.createdAt,
                    venue.updatedAt,
                    venue.archivedAt
                );
            }

            /*
             * Gigs
             */

            for (
                const gig
                of snapshot.gigs
            ) {
                await db.runAsync(
                    `
                    INSERT INTO gigs (
                        gig_id,
                        venue_id,
                        gig_date,
                        event_name,
                        notes,
                        status,
                        created_at,
                        updated_at,
                        start_time,
                        end_time
                    )
                    VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?
                    )

                    ON CONFLICT(gig_id)
                    DO UPDATE SET
                        venue_id =
                            excluded.venue_id,

                        gig_date =
                            excluded.gig_date,

                        event_name =
                            excluded.event_name,

                        notes =
                            excluded.notes,

                        status =
                            excluded.status,

                        created_at =
                            excluded.created_at,

                        updated_at =
                            excluded.updated_at,

                        start_time =
                            excluded.start_time,

                        end_time =
                            excluded.end_time
                    `,
                    gig.gigId,
                    gig.venueId,
                    gig.gigDate,
                    gig.eventName,
                    gig.notes,
                    gig.status,
                    gig.createdAt,
                    gig.updatedAt,
                    gig.startTime,
                    gig.endTime
                );
            }

            /*
             * Gig ↔ bands
             */

            for (
                const gigBand
                of snapshot.gigBands
            ) {
                await db.runAsync(
                    `
                    INSERT INTO gig_bands (
                        gig_id,
                        band_id,
                        billing_order,
                        role
                    )
                    VALUES (?, ?, ?, ?)

                    ON CONFLICT(
                        gig_id,
                        band_id
                    )
                    DO UPDATE SET
                        billing_order =
                            excluded.billing_order,

                        role =
                            excluded.role
                    `,
                    gigBand.gigId,
                    gigBand.bandId,
                    gigBand.billingOrder,
                    gigBand.role
                );
            }

            /*
             * Drink tokens
             */

            for (
                const drinkToken
                of snapshot.gigBandDrinkTokens
            ) {
                await db.runAsync(
                    `
                    INSERT INTO gig_band_drink_tokens (
                        token_id,
                        gig_id,
                        band_id,
                        used,
                        used_at
                    )
                    VALUES (?, ?, ?, ?, ?)

                    ON CONFLICT(token_id)
                    DO UPDATE SET
                        gig_id =
                            excluded.gig_id,

                        band_id =
                            excluded.band_id,

                        used =
                            excluded.used,

                        used_at =
                            excluded.used_at
                    `,
                    drinkToken.tokenId,
                    drinkToken.gigId,
                    drinkToken.bandId,
                    drinkToken.used
                        ? 1
                        : 0,
                    drinkToken.usedAt
                );
            }

            /*
             * Users
             */

            for (
                const user
                of snapshot.users
            ) {
                await db.runAsync(
                    `
                    INSERT INTO users (
                        user_id,
                        email,
                        display_name,
                        created_at,
                        updated_at
                    )
                    VALUES (?, ?, ?, ?, ?)

                    ON CONFLICT(user_id)
                    DO UPDATE SET
                        email =
                            excluded.email,

                        display_name =
                            excluded.display_name,

                        created_at =
                            excluded.created_at,

                        updated_at =
                            excluded.updated_at
                    `,
                    user.userId,
                    user.email,
                    user.displayName,
                    user.createdAt,
                    user.updatedAt
                );
            }

            /*
             * User ↔ bands
             */

            for (
                const membership
                of snapshot.userBands
            ) {
                await db.runAsync(
                    `
                    INSERT INTO user_bands (
                        user_id,
                        band_id,
                        relationship
                    )
                    VALUES (?, ?, ?)

                    ON CONFLICT(
                        user_id,
                        band_id
                    )
                    DO UPDATE SET
                        relationship =
                            excluded.relationship
                    `,
                    membership.userId,
                    membership.bandId,
                    membership.relationship
                );
            }

            /*
             * Rehearsal locations
             */

            for (
                const location
                of snapshot.rehearsalLocations
            ) {
                await db.runAsync(
                    `
                    INSERT INTO rehearsal_locations (
                        rehearsal_location_id,
                        name,
                        address,
                        suburb,
                        state,
                        postcode,
                        phone,
                        email,
                        website,
                        booking_url,
                        default_session_minutes,
                        indicative_rate,
                        notes,
                        active,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?
                    )

                    ON CONFLICT(
                        rehearsal_location_id
                    )
                    DO UPDATE SET
                        name =
                            excluded.name,

                        address =
                            excluded.address,

                        suburb =
                            excluded.suburb,

                        state =
                            excluded.state,

                        postcode =
                            excluded.postcode,

                        phone =
                            excluded.phone,

                        email =
                            excluded.email,

                        website =
                            excluded.website,

                        booking_url =
                            excluded.booking_url,

                        default_session_minutes =
                            excluded.default_session_minutes,

                        indicative_rate =
                            excluded.indicative_rate,

                        notes =
                            excluded.notes,

                        active =
                            excluded.active,

                        created_at =
                            excluded.created_at,

                        updated_at =
                            excluded.updated_at
                    `,
                    location.rehearsalLocationId,
                    location.name,
                    location.address,
                    location.suburb,
                    location.state,
                    location.postcode,
                    location.phone,
                    location.email,
                    location.website,
                    location.bookingUrl,
                    location.defaultSessionMinutes,
                    location.indicativeRate,
                    location.notes,
                    location.active
                        ? 1
                        : 0,
                    location.createdAt,
                    location.updatedAt
                );
            }

            /*
             * Band ↔ rehearsal locations
             */

            for (
                const location
                of snapshot.bandRehearsalLocations
            ) {
                await db.runAsync(
                    `
                    INSERT INTO band_rehearsal_locations (
                        band_id,
                        rehearsal_location_id,
                        is_favourite,
                        notes,
                        created_at
                    )
                    VALUES (?, ?, ?, ?, ?)

                    ON CONFLICT(
                        band_id,
                        rehearsal_location_id
                    )
                    DO UPDATE SET
                        is_favourite =
                            excluded.is_favourite,

                        notes =
                            excluded.notes,

                        created_at =
                            excluded.created_at
                    `,
                    location.bandId,
                    location.rehearsalLocationId,
                    location.isFavourite
                        ? 1
                        : 0,
                    location.notes,
                    location.createdAt
                );
            }

            /*
             * Rehearsal proposals
             */

            for (
                const proposal
                of snapshot.rehearsalProposals
            ) {
                await db.runAsync(
                    `
                    INSERT INTO rehearsal_proposals (
                        proposal_id,
                        band_id,
                        proposed_by_user_id,
                        start_at,
                        end_at,
                        location,
                        notes,
                        status,
                        created_at,
                        updated_at,
                        rehearsal_location_id
                    )
                    VALUES (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?
                    )

                    ON CONFLICT(proposal_id)
                    DO UPDATE SET
                        band_id =
                            excluded.band_id,

                        proposed_by_user_id =
                            excluded.proposed_by_user_id,

                        start_at =
                            excluded.start_at,

                        end_at =
                            excluded.end_at,

                        location =
                            excluded.location,

                        notes =
                            excluded.notes,

                        status =
                            excluded.status,

                        created_at =
                            excluded.created_at,

                        updated_at =
                            excluded.updated_at,

                        rehearsal_location_id =
                            excluded.rehearsal_location_id
                    `,
                    proposal.proposalId,
                    proposal.bandId,
                    proposal.proposedByUserId,
                    proposal.startAt,
                    proposal.endAt,
                    proposal.location,
                    proposal.notes,
                    proposal.status,
                    proposal.createdAt,
                    proposal.updatedAt,
                    proposal.rehearsalLocationId
                );
            }

            /*
             * Sync metadata
             */

            await db.runAsync(
                `
                INSERT INTO sync_metadata (
                    sync_key,
                    sync_value,
                    updated_at
                )
                VALUES (
                    'bootstrap_version',
                    ?,
                    CURRENT_TIMESTAMP
                )

                ON CONFLICT(sync_key)
                DO UPDATE SET
                    sync_value =
                        excluded.sync_value,

                    updated_at =
                        CURRENT_TIMESTAMP
                `,
                String(
                    snapshot.syncVersion
                )
            );

            await db.runAsync(
                `
                INSERT INTO sync_metadata (
                    sync_key,
                    sync_value,
                    updated_at
                )
                VALUES (
                    'last_bootstrap_at',
                    ?,
                    CURRENT_TIMESTAMP
                )

                ON CONFLICT(sync_key)
                DO UPDATE SET
                    sync_value =
                        excluded.sync_value,

                    updated_at =
                        CURRENT_TIMESTAMP
                `,
                snapshot.syncedAt
            );
        }
    );
}