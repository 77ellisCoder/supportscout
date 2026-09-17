import {
    Router,
} from "express";

import {
    getUserById,
    login,
    loginWithGoogle,
    register,
    setPassword,
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

authRouter.post(
    "/google",
    async (
        req,
        res
    ) => {
        try {
            const {
                idToken,
            } =
                req.body ?? {};

            if (
                typeof idToken !==
                "string" ||
                !idToken.trim()
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Google ID token is required",
                    });
            }

            const result =
                await loginWithGoogle(
                    idToken.trim()
                );

            if (!result) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Unable to authenticate with Google",
                    });
            }

            return res.json(
                result
            );
        } catch (
        error
        ) {
            console.error(
                "Google login failed:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to log in with Google",
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

authRouter.put(
    "/password",
    requireAuth,
    async (
        req: AuthenticatedRequest,
        res
    ) => {
        try {
            const userId =
                req.auth?.userId;

            if (!userId) {
                return res
                    .status(401)
                    .json({
                        error:
                            "Authentication required",
                    });
            }

            const {
                password,
            } =
                req.body ?? {};

            if (
                typeof password !==
                "string" ||
                password.length < 8
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Password must be at least 8 characters",
                    });
            }

            await setPassword(
                userId,
                password
            );

            return res.json({
                success: true,
            });
        } catch (
        error
        ) {
            console.error(
                "Unable to set password:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to set password",
                });
        }
    }
);

authRouter.post(
    "/register",
    async (
        req,
        res
    ) => {
        try {
            const {
                email,
                password,
                displayName,
            } =
                req.body ?? {};

            if (
                typeof email !==
                "string" ||
                !email.trim()
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Email is required",
                    });
            }

            if (
                typeof password !==
                "string" ||
                password.length < 8
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Password must be at least 8 characters",
                    });
            }

            if (
                displayName !==
                undefined &&
                displayName !==
                null &&
                typeof displayName !==
                "string"
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid display name",
                    });
            }

            const result =
                await register(
                    email,
                    password,
                    displayName ?? null
                );

            return res
                .status(201)
                .json(
                    result
                );
        } catch (error) {
            if (
                error instanceof Error &&
                error.message ===
                "EMAIL_ALREADY_EXISTS"
            ) {
                return res
                    .status(409)
                    .json({
                        error:
                            "An account already exists with this email",
                    });
            }

            console.error(
                "Unable to register user:",
                error
            );

            return res
                .status(500)
                .json({
                    error:
                        "Unable to create account",
                });
        }
    }
);