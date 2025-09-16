import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useAuthStore } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";
import { useUserProfile } from "@/hooks/useAuth";
import { useTenantAuth } from "@/hooks/useTenantAuth";

/**
 * Master hook that orchestrates the complete authentication + tenant flow
 * This hook should be used in App.tsx to initialize everything
 */
export const useAuthIntegration = () => {
  const {
    setFirebaseUser,
    setUser,
    setLoading,
    setInitialized,
    firebaseUser,
    user,
    isLoading,
    isInitialized,
  } = useAuthStore();

  const { clearTenantData } = useTenantStore();

  // Fetch user profile when Firebase user exists
  const { data: profileData, error: profileError } = useUserProfile();

  // Initialize tenant data (this runs when user is available)
  const { isLoading: tenantLoading } = useTenantAuth();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser);

      if (!firebaseUser) {
        // User logged out - clear everything
        setUser(null);
        clearTenantData();
        setLoading(false);
        setInitialized(true);
      } else {
        // User logged in - wait for profile data
        setLoading(true);
      }
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setUser, setLoading, setInitialized, clearTenantData]);

  // Set backend user when profile loads
  useEffect(() => {
    if (profileData && firebaseUser && !user) {
      setUser(profileData);
      setLoading(false);
      setInitialized(true);
    }
  }, [profileData, firebaseUser, user, setUser, setLoading, setInitialized]);

  // Handle profile loading errors
  useEffect(() => {
    if (profileError && firebaseUser) {
      console.error("Profile loading error:", profileError);
      setLoading(false);
      setInitialized(true);
    }
  }, [profileError, firebaseUser, setLoading, setInitialized]);

  // Calculate overall loading state
  const isFullyLoaded = isInitialized && !isLoading && !tenantLoading;
  const hasAuthError = !!profileError;

  return {
    isLoading: !isFullyLoaded,
    isAuthenticated: !!firebaseUser && !!user,
    hasError: hasAuthError,
    isInitialized,
    user,
    firebaseUser,
  };
};
