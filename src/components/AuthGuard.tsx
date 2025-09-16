import { Navigate, useLocation } from "react-router-dom";
import { Box, Spinner, VStack, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/authStore";
import { useTenantAuth } from "@/hooks/useTenantAuth";
import { useTranslation } from "react-i18next";

interface AuthGuardProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
  requireTenant?: boolean;
}

export const AuthGuard = ({
  children,
  requireSuperAdmin = false,
  requireTenant = false,
}: AuthGuardProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const {
    isAuthenticated,
    isLoading: authLoading,
    isInitialized,
  } = useAuthStore();
  const { isLoading: tenantLoading, isSuperAdmin } = useTenantAuth();

  // Show loading while authentication or tenant data is being processed
  if (authLoading || !isInitialized || tenantLoading) {
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
              {tenantLoading ? t("tenant.loading") : t("auth.loadingSubtitle")}
            </Text>
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check super admin requirement
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check tenant requirement (user must NOT be super admin)
  if (requireTenant && isSuperAdmin) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return <>{children}</>;
};
