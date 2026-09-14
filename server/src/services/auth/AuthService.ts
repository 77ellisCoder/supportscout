import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    OAuth2Client,
} from "google-auth-library";

import { pool } from "../../database/postgres";

type AuthUser = {
    userId: number;
    email: string;
    displayName: string | null;
};

type LoginResult = {
    token: string;
    user: AuthUser;
};

function getJwtSecret(): string {
    const secret =
        process.env.JWT_SECRET;

    if (!secret) {
        throw new Error(
            "JWT_SECRET is required"
        );
    }

    return secret;
}

export async function login(
    email: string,
    password: string
): Promise<LoginResult | null> {
    const result =
        await pool.query(
            `
            SELECT
                u.user_id::int
                    AS "userId",

                u.email,

                u.display_name
                    AS "displayName",

                c.password_hash
                    AS "passwordHash"

            FROM users u

            INNER JOIN user_auth_credentials c
                ON c.user_id = u.user_id

            WHERE LOWER(u.email) =
                LOWER($1)

            LIMIT 1
            `,
            [email]
        );

    const row =
        result.rows[0];

    if (!row) {
        return null;
    }

    const valid =
        await bcrypt.compare(
            password,
            row.passwordHash
        );

    if (!valid) {
        return null;
    }

    const user: AuthUser = {
        userId:
            row.userId,

        email:
            row.email,

        displayName:
            row.displayName,
    };

    const token =
        createToken(
            user
        );

    return {
        token,
        user,
    };
}

export async function getUserById(
    userId: number
): Promise<AuthUser | null> {
    const result =
        await pool.query(
            `
            SELECT
                user_id::int
                    AS "userId",

                email,

                display_name
                    AS "displayName"

            FROM users

            WHERE user_id = $1

            LIMIT 1
            `,
            [userId]
        );

    return (
        result.rows[0] ??
        null
    );
}

export function verifyToken(
    token: string
): {
    userId: number;
} {
    const payload =
        jwt.verify(
            token,
            getJwtSecret()
        );

    if (
        typeof payload ===
        "string" ||
        typeof payload.userId !==
        "number"
    ) {
        throw new Error(
            "Invalid authentication token"
        );
    }

    return {
        userId:
            payload.userId,
    };
}

export async function setPassword(
    userId: number,
    password: string
): Promise<void> {
    const passwordHash =
        await bcrypt.hash(
            password,
            12
        );

    await pool.query(
        `
        INSERT INTO user_auth_credentials (
            user_id,
            password_hash
        )
        VALUES (
            $1,
            $2
        )

        ON CONFLICT (user_id)
        DO UPDATE SET
            password_hash =
                EXCLUDED.password_hash,

            updated_at =
                NOW()
        `,
        [
            userId,
            passwordHash,
        ]
    );
}

export async function loginWithGoogle(
    idToken: string
): Promise<LoginResult | null> {
    const googleClient =
        new OAuth2Client(
            getGoogleClientId()
        );

    const ticket =
        await googleClient.verifyIdToken({
            idToken,
            audience:
                getGoogleClientId(),
        });

    const payload =
        ticket.getPayload();

    if (
        !payload ||
        !payload.sub ||
        !payload.email ||
        payload.email_verified !== true
    ) {
        return null;
    }

    const googleUserId =
        payload.sub;

    const email =
        payload.email.trim();

    const displayName =
        payload.name?.trim() ||
        null;

    const client =
        await pool.connect();

    try {
        await client.query(
            "BEGIN"
        );

        /*
         * First see whether this Google identity
         * is already linked to a SupportScout user.
         */

        const identityResult =
            await client.query(
                `
                SELECT
                    u.user_id::int
                        AS "userId",

                    u.email,

                    u.display_name
                        AS "displayName"

                FROM user_auth_identities i

                INNER JOIN users u
                    ON u.user_id =
                        i.user_id

                WHERE i.provider = 'google'
                  AND i.provider_user_id = $1

                LIMIT 1
                `,
                [
                    googleUserId,
                ]
            );

        let user: AuthUser | null =
            identityResult.rows[0] ??
            null;

        /*
         * No Google identity yet.
         *
         * Try to link it to an existing user
         * with the same verified email.
         */

        if (!user) {
            const existingUserResult =
                await client.query(
                    `
                    SELECT
                        user_id::int
                            AS "userId",

                        email,

                        display_name
                            AS "displayName"

                    FROM users

                    WHERE LOWER(email) =
                        LOWER($1)

                    LIMIT 1
                    `,
                    [
                        email,
                    ]
                );

            user =
                existingUserResult.rows[0] ??
                null;

            /*
             * No SupportScout account either,
             * so create one.
             */

            if (!user) {
                const newUserResult =
                    await client.query(
                        `
                        INSERT INTO users (
                            email,
                            display_name
                        )
                        VALUES (
                            $1,
                            $2
                        )

                        RETURNING
                            user_id::int
                                AS "userId",

                            email,

                            display_name
                                AS "displayName"
                        `,
                        [
                            email,
                            displayName,
                        ]
                    );

                user =
                    newUserResult.rows[0];
            }

            if (!user) {
                throw new Error(
                    "Unable to resolve Google user"
                );
            }

            /*
             * Link the Google account to the
             * SupportScout user.
             */

            await client.query(
                `
                INSERT INTO user_auth_identities (
                    user_id,
                    provider,
                    provider_user_id,
                    email
                )
                VALUES (
                    $1,
                    'google',
                    $2,
                    $3
                )

                ON CONFLICT (
                    provider,
                    provider_user_id
                )
                DO NOTHING
                `,
                [
                    user.userId,
                    googleUserId,
                    email,
                ]
            );
        }

        if (!user) {
            throw new Error(
                "Unable to resolve Google user"
            );
        }

        await client.query(
            "COMMIT"
        );

        return {
            token:
                createToken(
                    user
                ),

            user,
        };
    } catch (
    error
    ) {
        await client.query(
            "ROLLBACK"
        );

        throw error;
    } finally {
        client.release();
    }
}

function getGoogleClientId(): string {
    const clientId =
        process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        throw new Error(
            "GOOGLE_CLIENT_ID is required"
        );
    }

    return clientId;
}

function createToken(
    user: AuthUser
): string {
    return jwt.sign(
        {
            userId:
                user.userId,
        },
        getJwtSecret(),
        {
            expiresIn:
                "7d",
        }
    );
}