import { create } from "zustand";
import { persist } from "zustand/middleware";

const appStore = (set) => ({
  dopen: true,
  updateopen: (dopen) => set((state) => ({ dopen: dopen })),
});

const persistedAppStore = persist(appStore, { name: "my_app_store" });
export const useAppStore = create(persistedAppStore);
