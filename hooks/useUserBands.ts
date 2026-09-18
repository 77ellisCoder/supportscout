import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Platform,
} from "react-native";

import {
    bootstrapSync,
} from "../services/sync/BootstrapSyncService";

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

async function refreshUserBands(
    queryClient: ReturnType<
        typeof useQueryClient
    >
) {
    if (
        Platform.OS !==
        "web"
    ) {
        await bootstrapSync();
    }

    await queryClient.invalidateQueries({
        queryKey: [
            "user-bands",
            "mine",
        ],
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
            await refreshUserBands(
                queryClient
            );
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
            await refreshUserBands(
                queryClient
            );
        },
    });
}