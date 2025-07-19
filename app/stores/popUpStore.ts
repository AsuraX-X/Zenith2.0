import { create } from "zustand";

interface PopUpState {
  popUpCount: number;
}

interface PopUpActions {
  addPopUp: () => void;
  removePopUp: () => void;
}

type PopUpStore = PopUpState & PopUpActions;

export const usePopUpStore = create<PopUpStore>()((set) => ({
  // State
  popUpCount: 0,

  // Actions
  addPopUp: () => {
    set((state) => ({ popUpCount: state.popUpCount + 1 }));
  },

  removePopUp: () => {
    set((state) => ({
      popUpCount: Math.max(0, state.popUpCount - 1), // Prevent negative values
    }));
  },
}));
