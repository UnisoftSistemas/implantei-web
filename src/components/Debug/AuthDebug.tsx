import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Code,
} from "@chakra-ui/react";
import { useAuthStore } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";
import { usePermissions } from "@/hooks/usePermissions";
import { useLogout } from "@/hooks/useAuth";

/**
 * Debug component to test auth + tenant integration
 * Remove this in production!
 */
export const AuthDebug = () => {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuthStore();

  const {
    currentTenant,
    availableTenants,
    isSuperAdmin,
    isLoading: tenantLoading,
  } = useTenantStore();

  const permissions = usePermissions();
  const logoutMutation = useLogout();

  if (!process.env.NODE_ENV || process.env.NODE_ENV === "production") {
    return null; // Hide in production
  }

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="lg"
      border="1px"
      borderColor="gray.200"
      fontSize="xs"
      maxW="300px"
      zIndex={9999}
    >
      <VStack align="stretch" gap={2}>
        <Text fontWeight="bold" color="blue.600">
          🔍 Auth Debug
        </Text>

        {/* Auth Status */}
        <HStack justify="space-between">
          <Text>Authenticated:</Text>
          <Badge colorScheme={isAuthenticated ? "green" : "red"}>
            {isAuthenticated ? "Yes" : "No"}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text>Loading:</Text>
          <Badge colorScheme={isLoading ? "yellow" : "green"}>
            {isLoading ? "Loading" : "Ready"}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text>Initialized:</Text>
          <Badge colorScheme={isInitialized ? "green" : "red"}>
            {isInitialized ? "Yes" : "No"}
          </Badge>
        </HStack>

        {/* User Info */}
        {user && (
          <Box>
            <Text fontWeight="medium">User:</Text>
            <Code fontSize="xs" p={1}>
              {user.name} ({user.role})
            </Code>
            {user.tenantCompanyId && (
              <Code fontSize="xs" p={1} mt={1}>
                Tenant: {user.tenantCompanyId.slice(0, 8)}...
              </Code>
            )}
          </Box>
        )}

        {/* Tenant Info */}
        <HStack justify="space-between">
          <Text>Super Admin:</Text>
          <Badge colorScheme={isSuperAdmin ? "red" : "blue"}>
            {isSuperAdmin ? "Yes" : "No"}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text>Tenant Loading:</Text>
          <Badge colorScheme={tenantLoading ? "yellow" : "green"}>
            {tenantLoading ? "Loading" : "Ready"}
          </Badge>
        </HStack>

        {currentTenant && (
          <Box>
            <Text fontWeight="medium">Current Tenant:</Text>
            <Code fontSize="xs" p={1}>
              {currentTenant.name}
            </Code>
          </Box>
        )}

        {availableTenants.length > 0 && (
          <Box>
            <Text fontWeight="medium">Available Tenants:</Text>
            <Code fontSize="xs" p={1}>
              {availableTenants.length} tenants
            </Code>
          </Box>
        )}

        {/* Permissions */}
        <Box>
          <Text fontWeight="medium">Permissions:</Text>
          <HStack wrap="wrap" gap={1}>
            {permissions.canManageTenants && (
              <Badge size="xs" colorScheme="red">
                Tenants
              </Badge>
            )}
            {permissions.canManageUsers && (
              <Badge size="xs" colorScheme="blue">
                Users
              </Badge>
            )}
            {permissions.canManageProjects && (
              <Badge size="xs" colorScheme="green">
                Projects
              </Badge>
            )}
            {permissions.canAccessDashboard && (
              <Badge size="xs" colorScheme="purple">
                Dashboard
              </Badge>
            )}
          </HStack>
        </Box>

        {/* Quick Actions */}
        <Button
          size="xs"
          colorScheme="red"
          variant="outline"
          onClick={() => logoutMutation.mutate()}
          loading={logoutMutation.isPending}
        >
          Logout
        </Button>
      </VStack>
    </Box>
  );
};
