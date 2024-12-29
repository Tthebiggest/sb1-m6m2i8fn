import { create } from 'zustand';
import { CustomTier, DEFAULT_TIERS } from '../types/tiers';

interface TierStore {
  customTiers: CustomTier[];
  addTier: (tier: CustomTier) => void;
  updateTier: (id: string, tier: Partial<CustomTier>) => void;
  deleteTier: (id: string) => void;
}

export const useTierStore = create<TierStore>((set) => ({
  customTiers: DEFAULT_TIERS,
  addTier: (tier) =>
    set((state) => ({
      customTiers: [...state.customTiers, tier],
    })),
  updateTier: (id, updates) =>
    set((state) => ({
      customTiers: state.customTiers.map((tier) =>
        tier.id === id ? { ...tier, ...updates } : tier
      ),
    })),
  deleteTier: (id) =>
    set((state) => ({
      customTiers: state.customTiers.filter((tier) => tier.id !== id),
    })),
}));