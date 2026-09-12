import {
    DAVClient,
} from "tsdav";

import ICAL from "ical.js";

import {
    decryptToken,
} from "./crypto";

import type {
    BusyPeriod,
} from "./types";

function createClient(
    username: string,
    password: string
) {
    return new DAVClient({
        serverUrl:
            "https://caldav.icloud.com",

        credentials: {
            username,
            password,
        },

        authMethod: "Basic",

        defaultAccountType:
            "caldav",
    });
}

export async function testICloudConnection(
    username: string,
    password: string
) {
    const client =
        createClient(
            username,
            password
        );

    await client.login();

    const calendars =
        await client.fetchCalendars();

    return calendars;
}

function isCancelled(
    component: ICAL.Component
): boolean {
    return (
        component
            .getFirstPropertyValue(
                "status"
            ) === "CANCELLED"
    );
}

function isTransparent(
    component: ICAL.Component
): boolean {
    return (
        component
            .getFirstPropertyValue(
                "transp"
            ) === "TRANSPARENT"
    );
}

function overlapsRange(
    start: Date,
    end: Date,
    from: Date,
    to: Date
): boolean {
    return (
        start < to &&
        end > from
    );
}

function recurrenceKey(
    time: ICAL.Time
): string {
    return time
        .toJSDate()
        .toISOString();
}

function getEventPeriod(
    component: ICAL.Component
): BusyPeriod | null {
    if (
        isCancelled(component) ||
        isTransparent(component)
    ) {
        return null;
    }

    const event =
        new ICAL.Event(
            component
        );

    return {
        start:
            event.startDate
                .toJSDate(),

        end:
            event.endDate
                .toJSDate(),
    };
}

function expandEventComponents(
    eventComponents: ICAL.Component[],
    from: Date,
    to: Date
): BusyPeriod[] {
    const busy: BusyPeriod[] = [];

    const byUid =
        groupComponentsByUid(
            eventComponents
        );

    for (const components of byUid.values()) {
        const master =
            findMasterEvent(
                components
            );

        if (!master) {
            busy.push(
                ...getStandaloneBusyPeriods(
                    components,
                    from,
                    to
                )
            );

            continue;
        }

        if (!isRecurringEvent(master)) {
            const period =
                getEventPeriod(master);

            if (
                period &&
                overlapsRange(
                    period.start,
                    period.end,
                    from,
                    to
                )
            ) {
                busy.push(period);
            }

            continue;
        }

        busy.push(
            ...expandRecurringEvent(
                master,
                components,
                from,
                to
            )
        );
    }

    return busy;
}

function groupComponentsByUid(
    components: ICAL.Component[]
): Map<string, ICAL.Component[]> {
    const grouped =
        new Map<
            string,
            ICAL.Component[]
        >();

    for (const component of components) {
        const uid =
            component.getFirstPropertyValue(
                "uid"
            );

        if (typeof uid !== "string" || !uid) {
            continue;
        }

        const entries =
            grouped.get(uid) ?? [];

        entries.push(component);

        grouped.set(
            uid,
            entries
        );
    }

    return grouped;
}

function findMasterEvent(
    components: ICAL.Component[]
): ICAL.Component | undefined {
    return components.find(
        (component) =>
            !component.hasProperty(
                "recurrence-id"
            )
    );
}

function isRecurringEvent(
    component: ICAL.Component
): boolean {
    return (
        component.hasProperty("rrule") ||
        component.hasProperty("rdate")
    );
}

function getStandaloneBusyPeriods(
    components: ICAL.Component[],
    from: Date,
    to: Date
): BusyPeriod[] {
    const busy: BusyPeriod[] = [];

    for (const component of components) {
        const period =
            getEventPeriod(
                component
            );

        if (
            period &&
            overlapsRange(
                period.start,
                period.end,
                from,
                to
            )
        ) {
            busy.push(period);
        }
    }

    return busy;
}

function expandRecurringEvent(
    master: ICAL.Component,
    components: ICAL.Component[],
    from: Date,
    to: Date
): BusyPeriod[] {
    const busy: BusyPeriod[] = [];

    const event =
        new ICAL.Event(master);

    if (
        isCancelled(master) ||
        isTransparent(master)
    ) {
        return busy;
    }

    const dtstart =
        master.getFirstPropertyValue(
            "dtstart"
        );

    if (!(dtstart instanceof ICAL.Time)) {
        console.warn(
            "Recurring iCloud event has no valid DTSTART"
        );

        return busy;
    }

    const durationMs =
        event.endDate.toJSDate().getTime() -
        event.startDate.toJSDate().getTime();

    const exceptions =
        buildRecurrenceExceptionMap(
            components
        );

    const iterator =
        event.iterator();

    const MAX_ITERATIONS = 10000;

    let iterations = 0;

    while (
        iterations <
        MAX_ITERATIONS
    ) {
        const occurrence =
            iterator.next();

        if (!occurrence) {
            break;
        }

        iterations++;

        const occurrenceStart =
            occurrence.toJSDate();

        if (
            occurrenceStart >= to
        ) {
            break;
        }

        // if (
        //     occurrenceStart >=
        //     new Date(
        //         "2026-09-13T00:00:00.000Z"
        //     ) &&
        //     occurrenceStart <
        //     new Date(
        //         "2026-09-16T00:00:00.000Z"
        //     )
        // ) {
        //     console.log(
        //         "ITERATION:",
        //         event.summary,
        //         occurrence.toString(),
        //         occurrenceStart.toISOString()
        //     );
        // }

        const exception =
            exceptions.get(
                recurrenceKey(
                    occurrence
                )
            );

        if (exception) {
            const period =
                getEventPeriod(
                    exception
                );

            if (
                period &&
                overlapsRange(
                    period.start,
                    period.end,
                    from,
                    to
                )
            ) {
                busy.push(period);
            }

            continue;
        }

        const occurrenceEnd =
            new Date(
                occurrenceStart.getTime() +
                durationMs
            );

        if (
            overlapsRange(
                occurrenceStart,
                occurrenceEnd,
                from,
                to
            )
        ) {
            busy.push({
                start: occurrenceStart,
                end: occurrenceEnd,
            });
        }
    }

    if (
        iterations >=
        MAX_ITERATIONS
    ) {
        console.warn(
            `Stopped expanding recurring iCloud event "${event.summary}" after ${MAX_ITERATIONS} iterations`
        );
    }

    return busy;
}

function buildRecurrenceExceptionMap(
    components: ICAL.Component[]
): Map<string, ICAL.Component> {
    const exceptions =
        new Map<
            string,
            ICAL.Component
        >();

    for (const component of components) {
        if (
            !component.hasProperty(
                "recurrence-id"
            )
        ) {
            continue;
        }

        const recurrenceId =
            component.getFirstPropertyValue(
                "recurrence-id"
            );

        if (
            recurrenceId instanceof
            ICAL.Time
        ) {
            exceptions.set(
                recurrenceKey(
                    recurrenceId
                ),
                component
            );
        }
    }

    return exceptions;
}

type ICloudCredentials = {
    username: string;
    encryptedPassword: string;
};

export async function getICloudBusyPeriods(
    credentials: ICloudCredentials,
    from: Date,
    to: Date
): Promise<BusyPeriod[]> {

    const client =
        createClient(
            credentials.username,
            decryptToken(
                credentials
                    .encryptedPassword
            )
        );

    await client.login();

    const calendars =
        await client.fetchCalendars();

    const busyPeriods:
        BusyPeriod[] = [];

    for (const calendar of calendars) {

        const objects =
            await client.fetchCalendarObjects({
                calendar,

                timeRange: {
                    start:
                        from.toISOString(),

                    end:
                        to.toISOString(),
                },
            });

        for (const object of objects) {
            if (!object.data) {
                continue;
            }

            try {
                const parsed =
                    ICAL.parse(
                        object.data
                    );

                const component =
                    new ICAL.Component(
                        parsed
                    );

                /*
                 * Register the VTIMEZONE definitions
                 * supplied in this VCALENDAR.
                 */
                const timezones =
                    component.getAllSubcomponents(
                        "vtimezone"
                    );

                for (
                    const timezoneComponent
                    of timezones
                ) {
                    const tzid =
                        timezoneComponent
                            .getFirstPropertyValue(
                                "tzid"
                            );

                    if (
                        typeof tzid ===
                        "string"
                    ) {
                        ICAL.TimezoneService.register(
                            new ICAL.Timezone({
                                component:
                                    timezoneComponent,
                                tzid,
                            })
                        );
                    }
                }

                const events =
                    component.getAllSubcomponents(
                        "vevent"
                    );

                const periods =
                    expandEventComponents(
                        events,
                        from,
                        to
                    );

                busyPeriods.push(
                    ...periods
                );
            } catch (error) {
                console.error(
                    "Unable to parse iCloud calendar object:",
                    object.url,
                    error
                );
            }
        }
    }

    busyPeriods.sort(
        (a, b) =>
            a.start.getTime() -
            b.start.getTime()
    );

    return busyPeriods;
}

