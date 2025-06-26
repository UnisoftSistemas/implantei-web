import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { LoginForm } from "../components/LoginForm";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} minH="100vh">
      {/* Left side - Branding/Illustration */}
      <GridItem
        bg="linear-gradient(135deg, #7c3aed 0%, #6b46c1 50%, #553c9a 100%)"
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        {/* Background decoration */}
        <Box
          position="absolute"
          top="-50%"
          left="-50%"
          width="200%"
          height="200%"
          bg="radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)"
          backgroundSize="40px 40px"
          opacity={0.3}
        />

        {/* Logo and branding content */}
        <Box textAlign="center" zIndex={1} color="white" px={8}>
          <Box
            fontSize="6xl"
            fontWeight="bold"
            mb={6}
            textShadow="0 2px 4px rgba(0,0,0,0.1)"
          >
            📋
          </Box>
          <Box fontSize="3xl" fontWeight="bold" mb={4}>
            implantei
          </Box>
          <Box fontSize="lg" opacity={0.9} maxW="300px" mx="auto">
            Execute e acompanhe processos a distância
          </Box>
          <Box
            mt={8}
            p={4}
            bg="rgba(255,255,255,0.1)"
            borderRadius="lg"
            backdropFilter="blur(10px)"
          >
            <Box fontSize="md" fontWeight="medium" mb={2}>
              Transformando a gestão de implantação
            </Box>
            <Box fontSize="sm" opacity={0.8}>
              Solução pensada para otimizar tempo, reduzir custos e acelerar
              resultados.
            </Box>
          </Box>
        </Box>
      </GridItem>

      {/* Right side - Login Form */}
      <GridItem
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
      >
        <Box w="full" maxW="400px">
          <LoginForm />
        </Box>
      </GridItem>
    </Grid>
  );
};
