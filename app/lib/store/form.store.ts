// formStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FormAnswersType } from "../feature/form/form.utils";

type FormContent = FormAnswersType;
interface FormStore {
  values: FormContent;
  _hydrated: boolean;

  setValues: (values: FormContent) => void;
  updateField: (key: string, value: string | number) => void;
  clear: () => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      values: {},
      _hydrated: false,
      setValues: (values) => set({ values }),
      updateField: (key, value) =>
        set((state) => ({ values: { ...state.values, [key]: value } })),
      clear: () => set({ values: {} }),
    }),
    {
      name: "form-store",
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
    },
  ),
);
