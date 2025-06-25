import {
  Box,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  VStack,
  Input,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";

export const Header = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
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
        {/* Search and page info */}
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
                bg: "white",
                borderColor: "brand.300",
                boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.1)",
              }}
            />
          </Box>
        </HStack>

        {/* Right section */}
        <HStack gap={4}>
          {/* Quick actions */}
          <HStack gap={2}>
            <Button
              size="sm"
              variant="ghost"
              borderRadius="xl"
              color="gray.600"
              _hover={{ bg: "gray.100", color: "gray.700" }}
            >
              <Text fontSize="lg">⚡</Text>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              borderRadius="xl"
              color="gray.600"
              _hover={{ bg: "gray.100", color: "gray.700" }}
            >
              <Text fontSize="lg">📊</Text>
            </Button>
          </HStack>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            p={3}
            borderRadius="xl"
            position="relative"
            _hover={{ bg: "gray.100" }}
          >
            <Box position="relative">
              <Text fontSize="xl">🔔</Text>
              <Box
                position="absolute"
                top="0"
                right="0"
                w="8px"
                h="8px"
                bg="red.500"
                borderRadius="full"
                border="2px solid white"
                boxShadow="sm"
              />
            </Box>
          </Button>

          {/* Divider */}
          <Box w="1px" h="32px" bg="gray.200" />

          {/* User section */}
          {user && (
            <HStack gap={3}>
              <Avatar.Root size="md">
                <Avatar.Image src={user.profileImageUrl} />
                <Avatar.Fallback
                  bg="brand.500"
                  color="white"
                  fontSize="sm"
                  fontWeight="semibold"
                >
                  {user.name.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>

              <VStack gap={0} align="start">
                <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                  {user.name}
                </Text>
                <Badge
                  size="sm"
                  colorScheme={getRoleBadgeColor(user.role)}
                  variant="subtle"
                  borderRadius="full"
                  px={2}
                >
                  {getRoleLabel(user.role)}
                </Badge>
              </VStack>
            </HStack>
          )}

          {/* Logout button */}
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            borderRadius="xl"
            borderColor="gray.200"
            _hover={{
              bg: "gray.50",
              borderColor: "gray.300",
              transform: "translateY(-1px)",
              boxShadow: "sm",
            }}
            _active={{
              transform: "translateY(0)",
              boxShadow: "none",
            }}
            transition="all 0.2s ease-in-out"
            onClick={handleLogout}
            loading={logoutMutation.isPending}
            loadingText={t("auth.loggingOut")}
          >
            {t("auth.logout")}
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};
