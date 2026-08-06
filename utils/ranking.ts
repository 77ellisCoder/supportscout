export type WeightedScore = { score: number; weight: number; confidence?: number };
export function calculateRanking(scores: WeightedScore[]): number {
  const totalWeight = scores.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  const total = scores.reduce((sum, item) => {
    const confidence = item.confidence === undefined ? 1 : 0.8 + Math.min(5, Math.max(1, item.confidence)) * 0.04;
    return sum + (item.score / 10) * item.weight * confidence;
  }, 0);
  return Number(((total / totalWeight) * 100).toFixed(2));
}
