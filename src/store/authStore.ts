import { create } from "zustand";
import type { User as FirebaseUser } from "firebase/auth";
import type { User } from "../types";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setFirebaseUser: (firebaseUser) =>
    set((state) => ({
      ...state,
      firebaseUser,
      isAuthenticated: !!firebaseUser,
    })),

  setUser: (user) =>
    set((state) => ({
      ...state,
      user,
    })),

  setLoading: (isLoading) =>
    set((state) => ({
      ...state,
      isLoading,
    })),

  logout: () =>
    set(() => ({
      firebaseUser: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })),
}));
