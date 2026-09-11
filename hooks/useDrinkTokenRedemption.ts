/**
 * Drink token redemption, used on Device ONLY
 */
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    DrinkTokenRepository,
} from "../repositories/device/DrinkTokenRepository";

export function useDrinkTokenRedemption(
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

    const useTokenMutation = useMutation({
        mutationFn: (
            tokenId: number
        ) =>
            DrinkTokenRepository.useToken(
                tokenId
            ),

        onSuccess: refresh,
    });

    return {
        ...query,

        useToken: (
            tokenId: number
        ) =>
            useTokenMutation.mutate(
                tokenId
            ),

        isUsing:
            useTokenMutation.isPending,
    };
}