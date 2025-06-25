import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Spinner, Center } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useAuthStore } from "./store/authStore";
import { useUserProfile } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AuthGuard } from "./components/AuthGuard";

function App() {
  const {
    setFirebaseUser,
    setLoading,
    setUser,
    isLoading,
    isAuthenticated,
    firebaseUser,
    user,
  } = useAuthStore();

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
            {isLoading
              ? "Carregando aplicação..."
              : "Carregando dados do usuário..."}
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
              <DashboardPage />
            </AuthGuard>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all - redirect to login or dashboard */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
