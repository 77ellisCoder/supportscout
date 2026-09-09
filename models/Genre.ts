/**
 * This type represents a genre, including it's id and name.
 */

export type Genre = {
  id: number;
  name: string;
};

export type CreateGenreInput = {
  id: number;
  name: string;
};
