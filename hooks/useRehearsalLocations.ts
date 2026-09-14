import {
    useQuery,
} from "@tanstack/react-query";

import {
    getRehearsalLocations,
} from "../services/rehearsals/RehearsalLocationService";

export function useRehearsalLocations(
    bandId: number
) {
    return useQuery({
        queryKey: [
            "band",
            bandId,
            "rehearsal-locations",
        ],

        queryFn: () =>
            getRehearsalLocations(
                bandId
            ),

        enabled:
            Number.isFinite(
                bandId
            ) &&
            bandId > 0,
    });
}