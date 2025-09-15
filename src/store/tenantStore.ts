import { create } from "zustand";
import type { ITenant } from "@/types";

interface TenantState {
  currentTenant: ITenant | null;
  availableTenants: ITenant[];
  isSuperAdmin: boolean;
  isLoading: boolean;

  // Actions
  setCurrentTenant: (tenant: ITenant | null) => void;
  setAvailableTenants: (tenants: ITenant[]) => void;
  setIsSuperAdmin: (isSuper: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearTenantData: () => void;

  // Helper functions
  getTenantName: () => string;
  canAccessTenant: (tenantId: string) => boolean;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  currentTenant: null,
  availableTenants: [],
  isSuperAdmin: false,
  isLoading: false,

  setCurrentTenant: (tenant) => set({ currentTenant: tenant }),

  setAvailableTenants: (tenants) => set({ availableTenants: tenants }),

  setIsSuperAdmin: (isSuper) => set({ isSuperAdmin: isSuper }),

  setLoading: (loading) => set({ isLoading: loading }),

  clearTenantData: () =>
    set({
      currentTenant: null,
      availableTenants: [],
      isSuperAdmin: false,
      isLoading: false,
    }),

  // Helper: Get current tenant name or "Global View"
  getTenantName: () => {
    const state = get();
    if (state.isSuperAdmin && !state.currentTenant) {
      return "Visão Global";
    }
    return state.currentTenant?.name || "Empresa não definida";
  },

  // Helper: Check if can access specific tenant
  canAccessTenant: (tenantId: string) => {
    const state = get();

    // Super admin can access any tenant
    if (state.isSuperAdmin) return true;

    // Regular user can only access their own tenant
    return state.currentTenant?.id === tenantId;
  },
}));
