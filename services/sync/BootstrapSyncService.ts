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
             * User ↔ band memberships
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
                    location.active ? 1 : 0,
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
             * Record successful bootstrap.
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