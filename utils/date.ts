export function parseDateValue(
    value: string | null | undefined
): Date | null {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    const isoDateOnlyMatch = trimmed.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (isoDateOnlyMatch) {
        const [_, year, month, day] = isoDateOnlyMatch;
        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day)
        );

        if (!Number.isNaN(date.getTime())) {
            return date;
        }
    }

    const parsed = new Date(trimmed);

    return Number.isNaN(parsed.getTime())
        ? null
        : parsed;
}
