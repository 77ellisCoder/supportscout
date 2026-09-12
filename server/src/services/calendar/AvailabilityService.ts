export type Interval = {
    start: Date;
    end: Date;
};

export type AvailabilityOptions = {
    startHour?: number;
    endHour?: number;
    minimumMinutes?: number;
    bufferMinutes?: number;
    includeWeekends?: boolean;
    utcOffsetMinutes?: number;
};

function mergeIntervals(
    intervals: Interval[]
): Interval[] {
    const sorted = [...intervals]
        .filter(
            (item) =>
                item.end > item.start
        )
        .sort(
            (a, b) =>
                a.start.getTime() -
                b.start.getTime()
        );

    const merged: Interval[] = [];

    for (const current of sorted) {
        const previous =
            merged[merged.length - 1];

        if (
            !previous ||
            current.start > previous.end
        ) {
            merged.push({
                start: new Date(
                    current.start
                ),
                end: new Date(current.end),
            });
            continue;
        }

        if (
            current.end >
            previous.end
        ) {
            previous.end = new Date(
                current.end
            );
        }
    }

    return merged;
}

/**
 * Calculates working-hour availability.
 *
 * The default UTC offset is +08:00 for SupportScout's
 * primary Perth use case. Keep this configurable if the
 * app is expanded to locations with DST.
 */
export function calculateAvailability(
    from: Date,
    to: Date,
    busyPeriods: Interval[],
    options: AvailabilityOptions = {}
): Interval[] {
    const {
        startHour = 8,
        endHour = 18,
        minimumMinutes = 30,
        bufferMinutes = 0,
        includeWeekends = false,
        utcOffsetMinutes = 480,
    } = options;

    const bufferedBusy =
        busyPeriods.map((item) => ({
            start: new Date(
                item.start.getTime() -
                bufferMinutes * 60_000
            ),
            end: new Date(
                item.end.getTime() +
                bufferMinutes * 60_000
            ),
        }));

    const busy =
        mergeIntervals(bufferedBusy);

    const result: Interval[] = [];

    // Walk UTC calendar days. Perth is UTC+08 and has no DST.
    // Establish the first calendar day in the configured local timezone,
    // then convert that local midnight back to UTC.
    const firstLocal = new Date(
        from.getTime() +
            utcOffsetMinutes * 60_000
    );
    firstLocal.setUTCHours(
        0,
        0,
        0,
        0
    );

    const firstDay = new Date(
        firstLocal.getTime() -
            utcOffsetMinutes * 60_000
    );

    for (
        let day = new Date(firstDay);
        day < to;
        day = new Date(
            day.getTime() +
            86_400_000
        )
    ) {
        // Convert the UTC day to the local weekday.
        const localDay =
            new Date(
                day.getTime() +
                utcOffsetMinutes *
                    60_000
            );

        const weekday =
            localDay.getUTCDay();

        if (
            !includeWeekends &&
            (weekday === 0 ||
                weekday === 6)
        ) {
            continue;
        }

        const localMidnightUtc =
                day.getTime();

        const windowStart =
            new Date(
                localMidnightUtc +
                startHour *
                    3_600_000
            );

        const windowEnd =
            new Date(
                localMidnightUtc +
                endHour *
                    3_600_000
            );

        let cursor =
            new Date(
                Math.max(
                    windowStart.getTime(),
                    from.getTime()
                )
            );

        const dayEnd =
            new Date(
                Math.min(
                    windowEnd.getTime(),
                    to.getTime()
                )
            );

        if (cursor >= dayEnd) continue;

        for (const blocked of busy) {
            if (
                blocked.end <= cursor ||
                blocked.start >= dayEnd
            ) {
                continue;
            }

            const freeEnd =
                new Date(
                    Math.min(
                        blocked.start.getTime(),
                        dayEnd.getTime()
                    )
                );

            if (
                freeEnd.getTime() -
                    cursor.getTime() >=
                minimumMinutes *
                    60_000
            ) {
                result.push({
                    start: new Date(
                        cursor
                    ),
                    end: freeEnd,
                });
            }

            cursor =
                new Date(
                    Math.max(
                        cursor.getTime(),
                        blocked.end.getTime()
                    )
                );

            if (cursor >= dayEnd) break;
        }

        if (
            cursor < dayEnd &&
            dayEnd.getTime() -
                cursor.getTime() >=
                minimumMinutes *
                    60_000
        ) {
            result.push({
                start: cursor,
                end: dayEnd,
            });
        }
    }

    return result;
}
