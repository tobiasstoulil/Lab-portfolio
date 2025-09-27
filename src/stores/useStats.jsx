import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
// import { useShallow } from "zustand/shallow";

export default create(
  subscribeWithSelector((set, get) => {
    return {
      //
      scopeAnim: false,
      handleScopeAnim: () => set({ scopeAnim: true }),

      index: 0,
      increaseIndex: () => set((state) => ({ index: state.index + 1 })),
      setIndex: (i) => set({ index: i }),
    };
  })
);
