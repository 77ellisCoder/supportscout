import {
    NextFunction,
    Request,
    Response,
} from "express";

import {
    verifyToken,
} from "../services/auth/AuthService";

export type AuthenticatedRequest =
    Request & {
        auth?: {
            userId: number;
        };
    };

export function requireAuth(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const header =
        req.headers.authorization;

    if (
        !header ||
        !header.startsWith(
            "Bearer "
        )
    ) {
        return res
            .status(401)
            .json({
                error:
                    "Authentication required",
            });
    }

    const token =
        header.slice(
            "Bearer ".length
        );

    try {
        req.auth =
            verifyToken(
                token
            );

        next();
    } catch {
        return res
            .status(401)
            .json({
                error:
                    "Invalid or expired token",
            });
    }
}