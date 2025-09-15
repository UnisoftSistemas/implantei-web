import type { User } from "@/types/User";
import type { User as FirebaseUser } from "firebase/auth";

export interface ApiResponse<T> {
  user: User;
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

// Auth store interface
export interface AuthState {
  firebaseUser: FirebaseUser;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setFirebaseUser: (user: FirebaseUser) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}
