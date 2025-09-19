import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Spinner, Center } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { auth } from "@/services/firebase";
import { useAuthStore } from "@/store/authStore";
import { useUserProfile } from "@/hooks/useAuth";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { ProjectDetailsPage } from "@/pages/ProjectDetailsPage";
import { AuthGuard } from "@/components/AuthGuard";
import { SuperAdminRoutes } from "./routes/SuperAdminRoutes";
import { useTenantStore } from "./store/tenantStore";
import { SmartRedirect } from "./components/SmartRedirect";

function App() {
  const { t } = useTranslation();
  const {
    setFirebaseUser,
    setLoading,
    setUser,
    isLoading,
    firebaseUser,
    user,
  } = useAuthStore();

  const { isSuperAdmin } = useTenantStore();

  // Fetch user profile when Firebase user exists but backend user doesn't
  const { data: profileData, isLoading: profileLoading } = useUserProfile();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setLoading]);

  useEffect(() => {
    if (profileData && !user) {
      setUser(profileData);
    }
  }, [profileData, user, setUser]);

  // Show loading while:
  // 1. Firebase is initializing, OR
  // 2. We have Firebase user but no backend user and we're loading profile
  if (isLoading || (firebaseUser && !user && profileLoading)) {
    return (
      <Center h="100vh" bg="brand.500">
        <Box textAlign="center">
          <Spinner size="xl" color="white" borderWidth="4px" mb={4} />
          <Box color="white" fontSize="sm">
            {isLoading ? t("auth.loadingApp") : t("auth.loadingUserData")}
          </Box>
        </Box>
      </Center>
    );
  }

  return (
    <Box minH="100vh">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              {isSuperAdmin ? (
                <Navigate to="/super-admin/dashboard" replace />
              ) : (
                <DashboardPage />
              )}
            </AuthGuard>
          }
        />

        <Route
          path="/projects"
          element={
            <AuthGuard>
              {isSuperAdmin ? (
                <Navigate to="/super-admin/dashboard" replace />
              ) : (
                <ProjectsPage />
              )}
            </AuthGuard>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <AuthGuard>
              {isSuperAdmin ? (
                <Navigate to="/super-admin/dashboard" replace />
              ) : (
                <ProjectDetailsPage />
              )}
            </AuthGuard>
          }
        />

        {/* Super Admin routes - protected by TenantGuard inside SuperAdminRoutes */}
        <Route
          path="/super-admin/*"
          element={
            <AuthGuard>
              <SuperAdminRoutes />
            </AuthGuard>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<SmartRedirect />} />

        {/* Catch all - redirect to login or dashboard */}
        <Route path="*" element={<SmartRedirect />} />
      </Routes>
    </Box>
  );
}

export default App;
