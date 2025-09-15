import {
  Box,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  VStack,
  Input,
  Separator,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { TenantSwitcher } from "@/components/Tenant/TenantSwitcher";

export const Header = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "red";
      case "admin":
        return "purple";
      case "manager":
        return "blue";
      case "consultant":
        return "green";
      case "technician":
        return "orange";
      default:
        return "gray";
    }
  };

  const getRoleLabel = (role: string) => {
    return t(`user.roles.${role}`);
  };

  return (
    <Box
      bg="white"
      borderBottom="1px"
      borderColor="gray.100"
      px={8}
      py={4}
      boxShadow="sm"
    >
      <HStack justify="space-between" align="center">
        {/* Left side - Page info and search */}
        <HStack gap={6} flex={1}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={1}>
              {t("nav.dashboard")}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {t("dashboard.subtitle")}
            </Text>
          </Box>

          {/* Search bar */}
          <Box maxW="400px" flex={1}>
            <Input
              placeholder={t("search.placeholder")}
              size="md"
              borderRadius="xl"
              borderColor="gray.200"
              bg="gray.50"
              _placeholder={{ color: "gray.400", fontSize: "sm" }}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                bg: "white",
              }}
            />
          </Box>
        </HStack>

        {/* Right side - Tenant switcher and user info */}
        <HStack gap={4} align="center">
          {/* Tenant Switcher - only show if user has tenant permissions */}
          <TenantSwitcher />

          {/* Separator */}
          <Separator orientation="vertical" height="32px" />

          {/* User info */}
          <HStack gap={3}>
            <VStack gap={0} align="end">
              <HStack gap={2} align="center">
                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                  {user?.name}
                </Text>

                {/* Role badge with special styling for super admin */}
                <Badge
                  size="sm"
                  colorScheme={getRoleBadgeColor(user?.role || "")}
                  variant={user?.role === "super_admin" ? "solid" : "subtle"}
                >
                  {getRoleLabel(user?.role || "")}
                </Badge>
              </HStack>

              <Text fontSize="xs" color="gray.500">
                {user?.email}
              </Text>
            </VStack>
            <Avatar.Root size="md" color={"brand.500"}>
              <Avatar.Image src={user?.profileImageUrl} />
              <Avatar.Fallback fontSize="md">{user?.name}</Avatar.Fallback>
            </Avatar.Root>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLogout}
              loading={logoutMutation.isPending}
              loadingText={t("auth.loggingOut")}
              _hover={{ bg: "gray.100" }}
            >
              {t("auth.logout")}
            </Button>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  );
};
