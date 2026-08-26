// hooks/useDrinkTokens.ts

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { DrinkTokenRepository } from "../repositories/DrinkTokenRepository";

export function useDrinkTokens(
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
        enabled: gigId > 0 && bandId > 0,
    });

    const refresh = () =>
        queryClient.invalidateQueries({
            queryKey,
        });

    const useTokenMutation = useMutation({
        mutationFn: (tokenId: number) =>
            DrinkTokenRepository.useToken(tokenId),

        onSuccess: refresh,
    });

    const addTokenMutation = useMutation({
        mutationFn: () =>
            DrinkTokenRepository.addTokens(
                gigId,
                bandId,
                1
            ),

        onSuccess: refresh,
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

        useToken: (tokenId: number) =>
            useTokenMutation.mutate(tokenId),

        addToken: () =>
            addTokenMutation.mutate(),

        removeToken: () =>
            removeTokenMutation.mutate(),
    };
}