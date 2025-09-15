import { Navigate } from "react-router-dom";
import { Box, Spinner, VStack, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/authStore";
import { useTenantAuth } from "@/hooks/useTenantAuth";
import { useTranslation } from "react-i18next";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { isLoading: tenantLoading } = useTenantAuth();

  // Show loading while authentication or tenant data is being processed
  if (authLoading || tenantLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        bg="gray.50"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" borderWidth="4px" />
          <VStack gap={1}>
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              {t("auth.loading")}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {t("auth.loadingSubtitle")}
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
