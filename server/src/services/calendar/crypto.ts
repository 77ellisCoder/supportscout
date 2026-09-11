import crypto from "node:crypto";

const algorithm = "aes-256-gcm";

function getKey(): Buffer {
    const raw = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;

    if (!raw) {
        throw new Error(
            "GOOGLE_TOKEN_ENCRYPTION_KEY is required"
        );
    }

    const key = Buffer.from(raw, "base64");

    if (key.length !== 32) {
        throw new Error(
            "GOOGLE_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key"
        );
    }

    return key;
}

export function encryptToken(value: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(
        algorithm,
        getKey(),
        iv
    );

    const encrypted = Buffer.concat([
        cipher.update(value, "utf8"),
        cipher.final(),
    ]);

    const tag = cipher.getAuthTag();

    return [
        iv.toString("base64url"),
        tag.toString("base64url"),
        encrypted.toString("base64url"),
    ].join(".");
}

export function decryptToken(value: string): string {
    const [ivRaw, tagRaw, encryptedRaw] =
        value.split(".");

    if (!ivRaw || !tagRaw || !encryptedRaw) {
        throw new Error("Invalid encrypted token");
    }

    const decipher = crypto.createDecipheriv(
        algorithm,
        getKey(),
        Buffer.from(ivRaw, "base64url")
    );

    decipher.setAuthTag(
        Buffer.from(tagRaw, "base64url")
    );

    return Buffer.concat([
        decipher.update(
            Buffer.from(encryptedRaw, "base64url")
        ),
        decipher.final(),
    ]).toString("utf8");
}
