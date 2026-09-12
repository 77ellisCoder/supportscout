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

    console.log(
        "iCloud calendars:",
        calendars.map(
            (calendar) => ({
                displayName:
                    calendar.displayName,

                url:
                    calendar.url,
            })
        )
    );

    return calendars;
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

                const events =
                    component
                        .getAllSubcomponents(
                            "vevent"
                        );

                for (
                    const eventComponent
                    of events
                ) {
                    const event =
                        new ICAL.Event(
                            eventComponent
                        );

                    // Ignore cancelled events
                    const status =
                        eventComponent
                            .getFirstPropertyValue(
                                "status"
                            );

                    if (
                        status ===
                        "CANCELLED"
                    ) {
                        continue;
                    }

                    // Ignore events explicitly
                    // marked as "free"
                    const transparency =
                        eventComponent
                            .getFirstPropertyValue(
                                "transp"
                            );

                    if (
                        transparency ===
                        "TRANSPARENT"
                    ) {
                        continue;
                    }

                    const start =
                        event.startDate
                            .toJSDate();

                    const end =
                        event.endDate
                            .toJSDate();

                    // Ensure the event
                    // actually overlaps
                    // our requested range.
                    if (
                        start < to &&
                        end > from
                    ) {
                        busyPeriods.push({
                            start,
                            end,
                        });
                    }
                }

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