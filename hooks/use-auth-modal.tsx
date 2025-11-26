"use client";

import { create } from "zustand";

interface AuthIntent {
  returnUrl?: string;
  shouldStay?: boolean;
  action?: "login" | "register" | "checkout";
}

interface AuthModalStore {
  isOpen: boolean;
  intent?: AuthIntent;
  openModal: (intent?: AuthIntent) => void;
  closeModal: () => void;
  setIntent: (intent: AuthIntent) => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  intent: undefined,
  openModal: (intent) => set({ isOpen: true, intent }),
  closeModal: () => set({ isOpen: false, intent: undefined }),
  setIntent: (intent) => set({ intent }),
}));
