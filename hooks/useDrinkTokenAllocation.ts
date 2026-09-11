/**
 * Drink token allocation, used for Gig Edit, and on Web and Device
 */
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    DrinkTokenRepository,
} from "../repositories/Repository";

export function useDrinkTokenAllocation(
    gigId: number,
    bandId: number
) {
    const queryClient = useQueryClient();

    const queryKey = [
        "drinkTokens",
        gigId,
        bandId,
    ];

    const query = useQuery({
        queryKey,

        queryFn: () =>
            DrinkTokenRepository.getForGigBand(
                gigId,
                bandId
            ),

        enabled:
            gigId > 0 &&
            bandId > 0,
    });

    const refresh = () =>
        queryClient.invalidateQueries({
            queryKey,
        });

    const addTokenMutation = useMutation({
        mutationFn: () =>
            DrinkTokenRepository.addTokens(
                gigId,
                bandId,
                1
            ),

        onSuccess: refresh,

        onError: (error) => {
            console.error(
                "Failed to add drink token:",
                error
            );
        },
    });

    const removeTokenMutation = useMutation({
        mutationFn: () =>
            DrinkTokenRepository.removeUnusedToken(
                gigId,
                bandId
            ),

        onSuccess: refresh,
    });

    return {
        ...query,

        addToken: () =>
            addTokenMutation.mutate(),

        removeToken: () =>
            removeTokenMutation.mutate(),

        isAdding:
            addTokenMutation.isPending,

        isRemoving:
            removeTokenMutation.isPending,
    };
}