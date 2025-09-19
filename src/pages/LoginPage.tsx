import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, GridItem } from "@chakra-ui/react";
import { ModernLoginForm } from "../components/Login/ModernLoginForm";
import { useAuthStore } from "../store/authStore";
import PeopleBaloon from "@/components/Login/PeopleBaloon";

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
    <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} minH="100vh">
      {/* Left side - Visual/Illustration */}
      <GridItem
        bg="#4E20E3"
        display={{ base: "none", lg: "flex" }}
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
      >
        {/* Animated background elements */}
        <Box
          position="absolute"
          top="10%"
          left="10%"
          width="100px"
          height="100px"
          bg="rgba(255,255,255,0.1)"
          borderRadius="50%"
          animation="float 6s ease-in-out infinite"
        />

        <Box
          position="absolute"
          top="60%"
          right="15%"
          width="60px"
          height="60px"
          bg="rgba(255,255,255,0.08)"
          borderRadius="50%"
          animation="float 8s ease-in-out infinite reverse"
        />

        <Box
          position="absolute"
          bottom="20%"
          left="20%"
          width="80px"
          height="80px"
          bg="rgba(255,255,255,0.06)"
          borderRadius="50%"
          animation="float 7s ease-in-out infinite"
        />

        {/* People images following the exact layout */}
        <PeopleBaloon
          top="5%"
          right="15%"
          width="160px"
          height="160px"
          src="/images/people/person1.png"
          alt="Team member 1"
        />

        <PeopleBaloon
          top="12%"
          right="60%"
          width="160px"
          height="160px"
          src="/images/people/person2.png"
          alt="Team member 2"
        />

        <PeopleBaloon
          top="40%"
          right="5%"
          width="160px"
          height="160px"
          src="/images/people/person4.png"
          alt="Team member 4"
        />

        {/* Central content */}
        <Box
          position="absolute"
          bottom="30%"
          textAlign="center"
          color="white"
          px={8}
          bg="rgba(255,255,255,0.1)"
          borderRadius="2xl"
          backdropFilter="blur(20px)"
          border="1px solid rgba(255,255,255,0.2)"
          p={8}
          maxW="400px"
          mx="auto"
        >
          <Box fontSize="2xl" fontWeight="bold" mb={4}>
            Execute e acompanhe
            <br />
            processos a distância
          </Box>
          <Box fontSize="md" opacity={0.9} lineHeight={1.6}>
            Solução pensada para otimizar tempo, reduzir custos e acelerar
            resultados em implantações.
          </Box>
        </Box>

        <PeopleBaloon
          top="20%"
          left="37%"
          width="160px"
          height="160px"
          src="/images/people/person3.png"
          alt="Team member 3"
        />

        <PeopleBaloon
          bottom="10%"
          left="25%"
          width="160px"
          height="160px"
          src="/images/people/person5.png"
          alt="Team member 5"
        />

        {/* CSS animations */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
          `}
        </style>
      </GridItem>

      {/* Right side - Login Form */}
      <GridItem
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 6, md: 8 }}
        position="relative"
      >
        {/* Subtle background pattern */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity={0.02}
          bg="radial-gradient(circle at 20% 20%, #6366f1 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, #ec4899 0%, transparent 50%)"
        />

        <Box w="full" maxW="470px" position="relative" zIndex={1}>
          <ModernLoginForm />
        </Box>
      </GridItem>
    </Grid>
  );
};
