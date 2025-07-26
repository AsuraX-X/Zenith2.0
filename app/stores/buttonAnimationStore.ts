import { create } from "zustand";

interface animationActions {
  setAnimation: (animatin: string) => void;
}

interface animationState {
  animation: string;
}

type buttonAnimationStore = animationActions & animationState;

export const useButtonAnimationStore = create<buttonAnimationStore>()(
  (set) => ({
    animation: "",

    setAnimation: (newAnimation: string) => {
      set(() => ({ animation: newAnimation }));
    },
  })
);
