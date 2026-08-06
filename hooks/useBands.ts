import { useQuery } from "@tanstack/react-query";
export type BandListItem = { id: number; name: string; score?: number };
async function fetchBands(): Promise<BandListItem[]> { return []; }
export function useBands() {
  return useQuery({ queryKey: ["bands"], queryFn: fetchBands });
}
