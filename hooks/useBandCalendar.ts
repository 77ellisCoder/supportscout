import {
    useQuery,
} from "@tanstack/react-query";

import {
    getBandAvailability,
    getCalendarStatus,
} from "../services/calendar/CalendarService";

export function useBandCalendarStatus(
    bandId: number
) {
    return useQuery({
        queryKey: [
            "band",
            bandId,
            "calendar",
            "status",
        ],
        queryFn: () =>
            getCalendarStatus(
                bandId
            ),
        enabled:
            Number.isFinite(
                bandId
            ) && bandId > 0,
    });
}

export function useBandAvailability(
    bandId: number,
    from: Date,
    to: Date,
    enabled = true
) {
    return useQuery({
        queryKey: [
            "band",
            bandId,
            "calendar",
            "availability",
            from.toISOString(),
            to.toISOString(),
        ],

        queryFn: () => {

            return getBandAvailability(
                bandId,
                from,
                to
            );
        },

        enabled:
            enabled &&
            Number.isFinite(
                bandId
            ) &&
            bandId > 0,

        staleTime: 60_000,
    });
}
