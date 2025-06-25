import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Spinner, Center } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useAuthStore } from "./store/authStore";

// Placeholder components - will be created in next steps
const LoginPage = () => (
  <Center h="100vh" bg="brand.500" color="white">
    <Box textAlign="center">
      <h1>Implantei Login</h1>
      <p>Authentication coming next...</p>
    </Box>
  </Center>
);

const DashboardPage = () => (
  <Center h="100vh" bg="gray.50">
    <Box textAlign="center">
      <h1>Dashboard</h1>
      <p>Main app coming next...</p>
    </Box>
  </Center>
);

function App() {
  const { setFirebaseUser, setLoading, isLoading, isAuthenticated } =
    useAuthStore();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setLoading]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <Center h="100vh" bg="brand.500">
        <Spinner size="xl" color="white" borderWidth="4px" />
      </Center>
    );
  }

  return (
    <Box minH="100vh">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* More protected routes will be added here */}
          </>
        ) : (
          <Route path="*" element={<LoginPage />} />
        )}
      </Routes>
    </Box>
  );
}

export default App;
