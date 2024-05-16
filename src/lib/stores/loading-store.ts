import { create } from "zustand";

type Store = {
  loading: boolean;
  toggle: () => void;
  setLoading: (value: boolean) => void;
};

export const useLoadingStore = create<Store>((set) => ({
  loading: false,
  toggle: () => set((state) => ({ loading: !state.loading })),
  setLoading: (value) => set(() => ({ loading: value })),
}));
