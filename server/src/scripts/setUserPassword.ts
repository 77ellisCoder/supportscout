import "dotenv/config";

import {
    pool,
} from "../database/postgres";

import {
    setPassword,
} from "../services/auth/AuthService";

async function main() {
    const [
        ,
        ,
        userIdValue,
        password,
    ] =
        process.argv;

    const userId =
        Number(
            userIdValue
        );

    if (
        !Number.isFinite(
            userId
        ) ||
        userId <= 0 ||
        !password
    ) {
        console.error(
            "Usage: tsx server/src/scripts/setUserPassword.ts <userId> <password>"
        );

        process.exitCode =
            1;

        return;
    }

    await setPassword(
        userId,
        password
    );

    console.log(
        `Password updated for user ${userId}`
    );

    await pool.end();
}

main().catch(
    async (
        error
    ) => {
        console.error(
            error
        );

        process.exitCode =
            1;

        await pool.end();
    }
);