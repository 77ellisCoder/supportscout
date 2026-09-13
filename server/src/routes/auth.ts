import {
    Router,
} from "express";

import {
    getUserById,
    login,
} from "../services/auth/AuthService";

import {
    AuthenticatedRequest,
    requireAuth,
} from "../middleware/requireAuth";

export const authRouter =
    Router();

authRouter.post(
    "/login",
    async (
        req,
        res
    ) => {
        try {
            const {
                email,
                password,
            } =
                req.body ?? {};

            if (
                typeof email !==
                "string" ||
                typeof password !==
                "string" ||
                !email.trim() ||
                !password
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Email and password are required",
                    });
            }

            const result =
                await login(
                    email.trim(),
                    password
                );

            if (!result) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Invalid email or password",
                    });
            }

            return res.json(
                result
            );
        } catch (
        error
        ) {
            console.error(
                "Login failed:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to log in",
                });
        }
    }
);

authRouter.get(
    "/me",
    requireAuth,
    async (
        req: AuthenticatedRequest,
        res
    ) => {
        try {
            const userId =
                req.auth
                    ?.userId;

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Authentication required",
                    });
            }

            const user =
                await getUserById(
                    userId
                );

            if (!user) {
                return res
                    .status(404)
                    .json({
                        error:
                            "User not found",
                    });
            }

            return res.json(
                user
            );
        } catch (
        error
        ) {
            console.error(
                "Unable to load current user:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to load current user",
                });
        }
    }
);