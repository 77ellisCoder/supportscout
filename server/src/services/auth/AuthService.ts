import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        jwt.sign(
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