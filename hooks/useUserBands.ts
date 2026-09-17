import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    UserBandRepository,
} from "../repositories";

export function useMyBands() {
    return useQuery({
        queryKey: [
            "user-bands",
            "mine",
        ],

        queryFn: () =>
            UserBandRepository.getMine(),
    });
}

export function useAddMyBand() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            bandId: number
        ) =>
            UserBandRepository.add(
                bandId
            ),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [
                    "user-bands",
                    "mine",
                ],
            });
        },
    });
}

export function useRemoveMyBand() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            bandId: number
        ) =>
            UserBandRepository.remove(
                bandId
            ),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: [
                    "user-bands",
                    "mine",
                ],
            });
        },
    });
}