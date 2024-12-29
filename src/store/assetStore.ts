import { create } from 'zustand';
import { Asset, Tier } from '../types';

interface AssetStore {
  assets: Asset[];
  watchlist: string[];
  addAsset: (asset: Asset) => void;
  updateAsset: (asset: Asset) => void;
  setTier: (assetId: string, tier: Tier) => void;
  toggleWatchlist: (assetId: string) => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],
  watchlist: [],
  addAsset: (asset) =>
    set((state) => ({
      assets: [...state.assets, asset],
    })),
  updateAsset: (asset) =>
    set((state) => ({
      assets: state.assets.map((a) => (a.id === asset.id ? asset : a)),
    })),
  setTier: (assetId, tier) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, tier } : asset
      ),
    })),
  toggleWatchlist: (assetId) =>
    set((state) => ({
      watchlist: state.watchlist.includes(assetId)
        ? state.watchlist.filter((id) => id !== assetId)
        : [...state.watchlist, assetId],
    })),
}));