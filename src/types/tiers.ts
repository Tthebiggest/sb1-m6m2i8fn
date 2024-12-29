export interface CustomTier {
  id: string;
  name: string;
  color: string;
  description: string;
  criteria: {
    minPrice?: number;
    maxPrice?: number;
    minChange?: number;
    maxChange?: number;
    minPopularity?: number;
  };
}

export const DEFAULT_TIERS: CustomTier[] = [
  {
    id: 'high-growth',
    name: 'High Growth',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Assets with significant growth potential',
    criteria: {
      minChange: 5,
      minPopularity: 0.7,
    },
  },
  {
    id: 'stable',
    name: 'Stable',
    color: 'bg-blue-100 text-blue-800',
    description: 'Low volatility assets',
    criteria: {
      maxChange: 2,
      minChange: -2,
    },
  },
  {
    id: 'trending',
    name: 'Trending',
    color: 'bg-purple-100 text-purple-800',
    description: 'High social media interest',
    criteria: {
      minPopularity: 0.8,
    },
  },
];