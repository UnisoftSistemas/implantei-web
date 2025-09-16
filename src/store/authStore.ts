import { create } from "zustand";
import type { User as FirebaseUser } from "firebase/auth";
import type { User } from "@/types";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean; // Track if auth has been initialized

  // Actions
  setFirebaseUser: (user: FirebaseUser | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  logout: () => void;

  // Helper functions
  isSuperAdmin: () => boolean;
  canSwitchTenants: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isInitialized: false,

  setFirebaseUser: (firebaseUser) =>
    set((state) => {
      const newIsAuthenticated = !!firebaseUser && !!state.user;
      return {
        ...state,
        firebaseUser,
        isAuthenticated: newIsAuthenticated,
      };
    }),

  setUser: (user) =>
    set((state) => {
      const newIsAuthenticated = !!state.firebaseUser && !!user;
      return {
        ...state,
        user,
        isAuthenticated: newIsAuthenticated,
        isInitialized: true, // Mark as initialized when user is set
      };
    }),

  setLoading: (isLoading) =>
    set((state) => ({
      ...state,
      isLoading,
    })),

  setInitialized: (isInitialized) =>
    set((state) => ({
      ...state,
      isInitialized,
    })),

  logout: () =>
    set(() => ({
      firebaseUser: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isInitialized: true, // Keep initialized to avoid loading loops
    })),

  // Helper: Check if current user is super admin
  isSuperAdmin: () => {
    const state = get();
    return state.user?.role === "super_admin" || !state.user?.tenantCompanyId;
  },

  // Helper: Check if user can switch tenants
  canSwitchTenants: () => {
    const state = get();
    return state.user?.role === "super_admin" || !state.user?.tenantCompanyId;
  },
}));
