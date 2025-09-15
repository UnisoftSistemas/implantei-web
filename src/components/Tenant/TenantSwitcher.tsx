import {
  HStack,
  Text,
  Avatar,
  Button,
  Badge,
  Box,
  Spinner,
  Menu,
} from "@chakra-ui/react";
import { ChevronDown, Building2, Globe } from "lucide-react";
import { useTenantStore } from "@/store/tenantStore";
import { usePermissions } from "@/hooks/usePermissions";
import { useTranslation } from "react-i18next";

export const TenantSwitcher = () => {
  const { t } = useTranslation();
  const {
    currentTenant,
    availableTenants,
    isSuperAdmin,
    isLoading,
    setCurrentTenant,
  } = useTenantStore();
  const { canSwitchTenants } = usePermissions();

  // Loading state
  if (isLoading) {
    return (
      <HStack gap={2} px={3} py={2}>
        <Spinner size="sm" />
        <Text fontSize="sm" color="gray.500">
          {t("tenant.loading")}
        </Text>
      </HStack>
    );
  }

  // If user can't switch tenants, show current tenant only
  if (!canSwitchTenants) {
    return (
      <HStack gap={3} px={3} py={2} bg="gray.50" borderRadius="md">
        <Avatar.Root size="sm" color={"brand.500"}>
          <Avatar.Fallback fontSize="sm">{currentTenant?.name}</Avatar.Fallback>
        </Avatar.Root>
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="gray.800">
            {currentTenant?.name || t("tenant.noTenant")}
          </Text>
          {currentTenant?.segment && (
            <Text fontSize="xs" color="gray.500">
              {currentTenant.segment}
            </Text>
          )}
        </Box>
      </HStack>
    );
  }

  // Super admin tenant switcher
  const handleTenantChange = (tenantId: string | null) => {
    if (tenantId === "global") {
      setCurrentTenant(null);
    } else if (tenantId) {
      const tenant = availableTenants.find((t) => t.id === tenantId);
      setCurrentTenant(tenant || null);
    }
  };

  const getCurrentDisplayName = () => {
    if (isSuperAdmin && !currentTenant) {
      return t("tenant.globalView");
    }
    return currentTenant?.name || t("tenant.selectTenant");
  };

  const getCurrentIcon = () => {
    if (isSuperAdmin && !currentTenant) {
      return <Globe size={16} />;
    }
    return <Building2 size={16} />;
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          px={3}
          py={2}
          h="auto"
          justifyContent="flex-start"
          _hover={{ bg: "gray.100" }}
        >
          <HStack gap={3} flex={1}>
            {/* Icon */}
            <Box color="gray.600">{getCurrentIcon()}</Box>

            {/* Tenant info */}
            <Box flex={1} textAlign="left">
              <HStack gap={2} align="center">
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  {getCurrentDisplayName()}
                </Text>

                {/* Super Admin badge when in global view */}
                {isSuperAdmin && !currentTenant && (
                  <Badge size="sm" colorScheme="red" variant="solid">
                    {t("tenant.superAdmin")}
                  </Badge>
                )}
              </HStack>

              {/* Tenant segment or admin indicator */}
              {currentTenant?.segment && (
                <Text fontSize="xs" color="gray.500">
                  {currentTenant.segment}
                </Text>
              )}
              {isSuperAdmin && !currentTenant && (
                <Text fontSize="xs" color="gray.500">
                  {t("tenant.allTenants", { count: availableTenants.length })}
                </Text>
              )}
            </Box>

            {/* Dropdown arrow */}
            <ChevronDown size={14} color="gray.400" />
          </HStack>
        </Button>
      </Menu.Trigger>

      <Menu.Content minW="250px">
        {/* Global view option for super admin */}
        {isSuperAdmin && (
          <>
            <Menu.Item
              value="global"
              onClick={() => handleTenantChange("global")}
              bg={!currentTenant ? "blue.50" : "white"}
              _hover={{ bg: "blue.100" }}
            >
              <HStack gap={3}>
                <Globe size={16} />
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    {t("tenant.globalView")}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {t("tenant.allTenantsAccess")}
                  </Text>
                </Box>
              </HStack>
            </Menu.Item>

            {availableTenants.length > 0 && (
              <Box px={3} py={2}>
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.400"
                  textTransform="uppercase"
                >
                  {t("tenant.companies")}
                </Text>
              </Box>
            )}
          </>
        )}

        {/* Available tenants */}
        {availableTenants.map((tenant) => (
          <Menu.Item
            value="availableTenants"
            key={tenant.id}
            onClick={() => handleTenantChange(tenant.id)}
            bg={currentTenant?.id === tenant.id ? "blue.50" : "white"}
            _hover={{ bg: "blue.100" }}
          >
            <HStack gap={3} w="full">
              <Avatar.Root size="sm" color={"brand.500"}>
                <Avatar.Fallback fontSize="sm">{tenant.name}</Avatar.Fallback>
              </Avatar.Root>
              <Box flex={1}>
                <HStack justify="space-between" align="center">
                  <Text fontSize="sm" fontWeight="medium">
                    {tenant.name}
                  </Text>
                  {tenant.active && (
                    <Badge size="xs" colorScheme="green" variant="solid">
                      {t("common.active")}
                    </Badge>
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  {tenant.segment || t("tenant.noSegment")}
                </Text>
              </Box>
            </HStack>
          </Menu.Item>
        ))}

        {/* No tenants available */}
        {availableTenants.length === 0 && !isSuperAdmin && (
          <Menu.Item disabled value="noTenants">
            <Text fontSize="sm" color="gray.500">
              {t("tenant.noTenantsAvailable")}
            </Text>
          </Menu.Item>
        )}
      </Menu.Content>
    </Menu.Root>
  );
};
