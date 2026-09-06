/**
 * This type represents a genre, including its ID and name.
 */

export type Genre = {
  genreId: number;
  genreName?: string | null;
};

export type CreateGenreInput = {
  genreId: number;
  genreName?: string | null;
};
