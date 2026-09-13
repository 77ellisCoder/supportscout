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

export type AvailabilityWindow = {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
};

export type AvailabilitySettings = {
    minimumMinutes: number;
    bufferMinutes: number;
    utcOffsetMinutes?: number;
};

function parseTimeToMinutes(
    value: string
): number {
    const [
        hour,
        minute,
    ] = value
        .split(":")
        .map(Number);

    return (
        hour * 60 +
        minute
    );
}

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

export function calculateAvailabilityFromWindows(
    from: Date,
    to: Date,
    busyPeriods: Interval[],
    windows: AvailabilityWindow[],
    settings: AvailabilitySettings
): Interval[] {
    const {
        minimumMinutes,
        bufferMinutes,
        utcOffsetMinutes = 480,
    } = settings;

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
        mergeIntervals(
            bufferedBusy
        );

    const result: Interval[] = [];

    const firstLocal =
        new Date(
            from.getTime() +
            utcOffsetMinutes *
            60_000
        );

    firstLocal.setUTCHours(
        0,
        0,
        0,
        0
    );

    const firstDay =
        new Date(
            firstLocal.getTime() -
            utcOffsetMinutes *
            60_000
        );

    for (
        let day = new Date(
            firstDay
        );
        day < to;
        day = new Date(
            day.getTime() +
            86_400_000
        )
    ) {
        const localDay =
            new Date(
                day.getTime() +
                utcOffsetMinutes *
                60_000
            );

        const weekday =
            localDay.getUTCDay();

        const dayWindows =
            windows.filter(
                (window) =>
                    window.dayOfWeek ===
                    weekday
            );

        if (
            dayWindows.length ===
            0
        ) {
            continue;
        }

        for (
            const window of
            dayWindows
        ) {
            const startMinutes =
                parseTimeToMinutes(
                    window.startTime
                );

            const endMinutes =
                parseTimeToMinutes(
                    window.endTime
                );

            const windowStart =
                new Date(
                    day.getTime() +
                    startMinutes *
                    60_000
                );

            const windowEnd =
                new Date(
                    day.getTime() +
                    endMinutes *
                    60_000
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

            if (
                cursor >= dayEnd
            ) {
                continue;
            }

            for (
                const blocked of busy
            ) {
                if (
                    blocked.end <=
                    cursor ||
                    blocked.start >=
                    dayEnd
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
                        start:
                            new Date(
                                cursor
                            ),

                        end:
                            freeEnd,
                    });
                }

                cursor =
                    new Date(
                        Math.max(
                            cursor.getTime(),
                            blocked.end.getTime()
                        )
                    );

                if (
                    cursor >=
                    dayEnd
                ) {
                    break;
                }
            }

            if (
                cursor < dayEnd &&
                dayEnd.getTime() -
                cursor.getTime() >=
                minimumMinutes *
                60_000
            ) {
                result.push({
                    start:
                        cursor,

                    end:
                        dayEnd,
                });
            }
        }
    }

    return mergeIntervals(
        result
    );
}

export function intersectAvailability(
    availabilitySets: Interval[][]
): Interval[] {
    if (availabilitySets.length === 0) {
        return [];
    }

    let result = [...availabilitySets[0]];

    for (
        let i = 1;
        i < availabilitySets.length;
        i++
    ) {
        const next = availabilitySets[i];
        const intersection: Interval[] = [];

        for (const a of result) {
            for (const b of next) {
                const start = new Date(
                    Math.max(
                        a.start.getTime(),
                        b.start.getTime()
                    )
                );

                const end = new Date(
                    Math.min(
                        a.end.getTime(),
                        b.end.getTime()
                    )
                );

                if (start < end) {
                    intersection.push({
                        start,
                        end,
                    });
                }
            }
        }

        result = intersection;

        if (result.length === 0) {
            break;
        }
    }

    return result;
}

export function mergeBusyPeriods(
    periods: Interval[]
): Interval[] {
    if (periods.length === 0) {
        return [];
    }

    const sorted =
        [...periods].sort(
            (a, b) =>
                a.start.getTime() -
                b.start.getTime()
        );

    const merged: Interval[] = [
        {
            start:
                new Date(
                    sorted[0].start
                ),

            end:
                new Date(
                    sorted[0].end
                ),
        },
    ];

    for (
        let i = 1;
        i < sorted.length;
        i++
    ) {
        const current =
            sorted[i];

        const previous =
            merged[
            merged.length - 1
            ];

        if (
            current.start <=
            previous.end
        ) {
            if (
                current.end >
                previous.end
            ) {
                previous.end =
                    new Date(
                        current.end
                    );
            }
        } else {
            merged.push({
                start:
                    new Date(
                        current.start
                    ),

                end:
                    new Date(
                        current.end
                    ),
            });
        }
    }

    return merged;
}