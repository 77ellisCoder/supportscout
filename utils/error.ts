export function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    if (typeof error === "string") {
        return error.trim() || fallback;
    }

    if (error instanceof Error) {
        return error.message.trim() || fallback;
    }

    if (
        error &&
        typeof error === "object"
    ) {
        const record = error as Record<string, unknown>;

        if (
            typeof record.message === "string" &&
            record.message.trim()
        ) {
            return record.message.trim();
        }

        if (
            typeof record.error === "string" &&
            record.error.trim()
        ) {
            return record.error.trim();
        }
    }

    return fallback;
}
