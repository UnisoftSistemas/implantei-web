import { useMutation, useQuery } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { apiClient } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { User, ApiResponse } from "@/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// Hook for Firebase login
export const useLogin = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      // Step 1: Sign in with Firebase
      const firebaseResult = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Step 2: Get ID token and verify with backend
      const idToken = await firebaseResult.user.getIdToken();
      const response = await apiClient.post<ApiResponse<User>>("/auth/verify", {
        idToken,
      });

      return response.user;
    },
    onSuccess: (userData) => {
      setUser(userData);
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

// Hook for Firebase registration
export const useRegister = () => {
  return useMutation({
    mutationFn: async ({ name, email, password, phone }: RegisterData) => {
      await createUserWithEmailAndPassword(auth, email, password);

      const userData = {
        name,
        email,
        ...(phone ? { phone } : {}),
      };

      const response = await apiClient.post<ApiResponse<User>>(
        "/auth/register",
        userData
      );

      return response.data;
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
};

// Hook for logout
export const useLogout = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
};

// Hook to get current user profile from backend
export const useUserProfile = () => {
  const { firebaseUser } = useAuthStore();

  return useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<User>>("/auth/me");
      return response.user; // Fixed: use response.user instead of response.data
    },
    enabled: !!firebaseUser,
    staleTime: 60 * 60 * 1000, // 1 hour - user data doesn't change frequently
    gcTime: 2 * 60 * 60 * 1000, // 2 hours - keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch when returning to tab
    refetchOnReconnect: false, // Don't refetch when reconnecting internet
    retry: 1, // Only retry once if error occurs
  });
};
