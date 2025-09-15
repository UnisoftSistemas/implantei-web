import { Navigate } from "react-router-dom";
import { Box, Text, Spinner, VStack } from "@chakra-ui/react";
import { usePermissions } from "@/hooks/usePermissions";
import { useTenantStore } from "@/store/tenantStore";
import { useTranslation } from "react-i18next";

interface TenantGuardProps {
  children: React.ReactNode;
  requiredPermission?: "manage_tenants" | "manage_users" | "view_all_data";
  tenantId?: string;
  fallbackRoute?: string;
}

export const TenantGuard = ({
  children,
  requiredPermission,
  tenantId,
  fallbackRoute = "/dashboard",
}: TenantGuardProps) => {
  const { t } = useTranslation();
  const permissions = usePermissions();
  const { isLoading } = useTenantStore();

  // Show loading while tenant data is being fetched
  if (isLoading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="200px"
      >
        <VStack gap={3}>
          <Spinner size="lg" color="brand.500" />
          <Text color="gray.500">{t("tenant.loading")}</Text>
        </VStack>
      </Box>
    );
  }

  // Check specific tenant access
  if (tenantId && !permissions.canAccessTenant(tenantId)) {
    return <Navigate to={fallbackRoute} replace />;
  }

  // Check required permissions
  if (requiredPermission) {
    switch (requiredPermission) {
      case "manage_tenants":
        if (!permissions.canManageTenants) {
          return <Navigate to={fallbackRoute} replace />;
        }
        break;

      case "manage_users":
        if (!permissions.canManageUsers) {
          return <Navigate to={fallbackRoute} replace />;
        }
        break;

      case "view_all_data":
        if (!permissions.canViewAllData) {
          return <Navigate to={fallbackRoute} replace />;
        }
        break;

      default:
        console.warn(`Unknown permission: ${requiredPermission}`);
        break;
    }
  }

  return <>{children}</>;
};
