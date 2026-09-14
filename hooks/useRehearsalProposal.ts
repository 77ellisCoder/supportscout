import {
    useMutation,
} from "@tanstack/react-query";

import {
    createRehearsalProposal,
} from "../services/rehearsals/RehearsalProposalService";

export function useCreateRehearsalProposal() {
    return useMutation({
        mutationFn:
            createRehearsalProposal,
    });
}