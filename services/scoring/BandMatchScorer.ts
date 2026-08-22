const IGNORED_TERMS = new Set([
    "and",
    "the",
    "with",
    "music",
    "band",
]);

export function getSharedGenreTerms(
    sourceDescription: string | null,
    candidateDescription: string | null
): string[] {
    const sourceTerms =
        extractGenreTerms(sourceDescription);

    const candidateTerms =
        extractGenreTerms(candidateDescription);

    return Array.from(sourceTerms)
        .filter((term) =>
            candidateTerms.has(term)
        )
        .sort();
}

export function calculateGenreScore(
    sharedGenreTerms: string[]
): number {
    return Math.min(
        sharedGenreTerms.length,
        3
    );
}

function extractGenreTerms(
    value: string | null
): Set<string> {
    if (!value) {
        return new Set();
    }

    const terms = value
        .toLowerCase()

        // "indie-rock" → "indie rock"
        .replace(/[-_]/g, " ")

        // Remove punctuation
        .replace(/[^a-z0-9\s]/g, " ")

        .split(/\s+/)

        .map((term) => term.trim())

        .filter(
            (term) =>
                term.length > 2 &&
                !IGNORED_TERMS.has(term)
        );

    return new Set(terms);
}