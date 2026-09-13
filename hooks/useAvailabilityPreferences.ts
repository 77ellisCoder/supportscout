import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    AvailabilityPreferences,
    getAvailabilityPreferences,
    saveAvailabilityPreferences,
} from "../services/calendar/CalendarService";

export function useAvailabilityPreferences(
    userId: number
) {
    return useQuery({
        queryKey: [
            "user",
            userId,
            "availability",
            "preferences",
        ],

        queryFn: () =>
            getAvailabilityPreferences(
                userId
            ),

        enabled:
            Number.isFinite(
                userId
            ) &&
            userId > 0,
    });
}

export function useSaveAvailabilityPreferences(
    userId: number
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            preferences: Omit<
                AvailabilityPreferences,
                "userId"
            >
        ) =>
            saveAvailabilityPreferences(
                userId,
                preferences
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    "user",
                    userId,
                    "availability",
                    "preferences",
                ],
            });

            queryClient.invalidateQueries({
                predicate: (
                    query
                ) => {
                    const key =
                        query.queryKey;

                    return (
                        Array.isArray(
                            key
                        ) &&
                        key[0] ===
                        "band" &&
                        key[2] ===
                        "calendar" &&
                        key[3] ===
                        "availability"
                    );
                },
            });
        },
    });
}