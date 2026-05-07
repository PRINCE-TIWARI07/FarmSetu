import { create } from "zustand";

type UIState = {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
}));
