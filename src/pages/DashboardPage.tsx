import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/Layout";
import { useAuthStore } from "@/store/authStore";

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

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
    <MainLayout>
      <VStack gap={8} align="stretch">
        {/* Welcome section */}
        <Box>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
            {t("dashboard.title")} 👋
          </Text>
          <Text color="gray.600" fontSize="lg">
            {t("dashboard.subtitle")}
          </Text>
        </Box>

        {/* Stats grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          {[
            {
              label: t("dashboard.activeProjects"),
              value: "12",
              icon: "📋",
              color: "blue",
            },
            {
              label: t("dashboard.pendingTasks"),
              value: "34",
              icon: "✅",
              color: "orange",
            },
            {
              label: t("dashboard.clientCompanies"),
              value: "8",
              icon: "🏢",
              color: "green",
            },
            {
              label: t("dashboard.openTickets"),
              value: "5",
              icon: "🎫",
              color: "purple",
            },
          ].map((stat, index) => (
            <GridItem key={index}>
              <Box
                bg="white"
                p={6}
                borderRadius="2xl"
                border="1px"
                borderColor="gray.100"
                boxShadow="sm"
                _hover={{
                  boxShadow: "md",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s ease-in-out"
              >
                <HStack justify="space-between" mb={4}>
                  <Box
                    w="48px"
                    h="48px"
                    bg={`${stat.color}.50`}
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xl">{stat.icon}</Text>
                  </Box>
                  <Badge
                    colorScheme={stat.color}
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                  >
                    +12%
                  </Badge>
                </HStack>

                <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={1}>
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {stat.label}
                </Text>
              </Box>
            </GridItem>
          ))}
        </Grid>

        {/* Content sections */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Main content */}
          <GridItem>
            <VStack gap={6} align="stretch">
              {/* Recent projects */}
              <Box
                bg="white"
                p={6}
                borderRadius="2xl"
                border="1px"
                borderColor="gray.100"
                boxShadow="sm"
              >
                <HStack justify="space-between" mb={6}>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    {t("dashboard.recentProjects")}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="brand.500"
                    fontWeight="medium"
                    cursor="pointer"
                  >
                    {t("dashboard.seeAll")} →
                  </Text>
                </HStack>

                <VStack gap={4} align="stretch">
                  {[
                    {
                      name: "Sistema ERP - Empresa ABC",
                      status: t("project.status.inProgress"),
                      progress: "75%",
                    },
                    {
                      name: "CRM Implementation - XYZ Corp",
                      status: t("project.status.planning"),
                      progress: "25%",
                    },
                    {
                      name: "Migração de Dados - Tech Solutions",
                      status: t("project.status.completed"),
                      progress: "100%",
                    },
                  ].map((project, index) => (
                    <Box key={index} p={4} bg="gray.25" borderRadius="xl">
                      <HStack justify="space-between" mb={2}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.800"
                        >
                          {project.name}
                        </Text>
                        <Badge
                          size="sm"
                          colorScheme={
                            project.status === t("project.status.completed")
                              ? "green"
                              : project.status ===
                                t("project.status.inProgress")
                              ? "blue"
                              : "orange"
                          }
                          variant="subtle"
                          borderRadius="full"
                        >
                          {project.status}
                        </Badge>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        {t("project.progress")}: {project.progress}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* User info card */}
              {user && (
                <Box
                  bg="white"
                  p={6}
                  borderRadius="2xl"
                  border="1px"
                  borderColor="gray.100"
                  boxShadow="sm"
                >
                  <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.800">
                    {t("user.profile")}
                  </Text>
                  <VStack align="start" gap={3}>
                    <HStack>
                      <Text fontWeight="medium" minW="100px" color="gray.600">
                        {t("user.name")}:
                      </Text>
                      <Text color="gray.800">{user.name}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium" minW="100px" color="gray.600">
                        {t("user.email")}:
                      </Text>
                      <Text color="gray.800">{user.email}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="medium" minW="100px" color="gray.600">
                        {t("user.role")}:
                      </Text>
                      <Badge
                        colorScheme={getRoleBadgeColor(user.role)}
                        variant="subtle"
                        borderRadius="full"
                        px={3}
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                    </HStack>
                    {user.phone && (
                      <HStack>
                        <Text fontWeight="medium" minW="100px" color="gray.600">
                          {t("user.phone")}:
                        </Text>
                        <Text color="gray.800">{user.phone}</Text>
                      </HStack>
                    )}
                    <HStack>
                      <Text fontWeight="medium" minW="100px" color="gray.600">
                        {t("user.status")}:
                      </Text>
                      <Badge
                        colorScheme={user.active ? "green" : "red"}
                        variant="subtle"
                        borderRadius="full"
                        px={3}
                      >
                        {user.active ? t("user.active") : t("user.inactive")}
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </VStack>
          </GridItem>

          {/* Sidebar content */}
          <GridItem>
            <VStack gap={6} align="stretch">
              {/* Quick actions */}
              <Box
                bg="white"
                p={6}
                borderRadius="2xl"
                border="1px"
                borderColor="gray.100"
                boxShadow="sm"
              >
                <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                  {t("dashboard.quickActions")}
                </Text>

                <VStack gap={3} align="stretch">
                  {[
                    {
                      icon: "➕",
                      label: t("dashboard.newProject"),
                      color: "blue",
                    },
                    {
                      icon: "🏢",
                      label: t("dashboard.registerCompany"),
                      color: "green",
                    },
                    {
                      icon: "✅",
                      label: t("dashboard.newTask"),
                      color: "orange",
                    },
                    {
                      icon: "📊",
                      label: t("dashboard.reports"),
                      color: "purple",
                    },
                  ].map((action, index) => (
                    <HStack
                      key={index}
                      p={3}
                      bg="gray.25"
                      borderRadius="xl"
                      cursor="pointer"
                      _hover={{ bg: "gray.50" }}
                      transition="all 0.2s ease-in-out"
                    >
                      <Box
                        w="32px"
                        h="32px"
                        bg={`${action.color}.50`}
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize="sm">{action.icon}</Text>
                      </Box>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {action.label}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Activity feed */}
              <Box
                bg="white"
                p={6}
                borderRadius="2xl"
                border="1px"
                borderColor="gray.100"
                boxShadow="sm"
              >
                <Text fontSize="lg" fontWeight="bold" color="gray.800" mb={4}>
                  {t("dashboard.recentActivities")}
                </Text>

                <VStack gap={3} align="stretch">
                  {[
                    {
                      text: t("activities.projectUpdated"),
                      time: t("activities.timeAgo.hoursAgo", { count: 2 }),
                      type: "update",
                    },
                    {
                      text: t("activities.companyRegistered"),
                      time: t("activities.timeAgo.hoursAgo", { count: 4 }),
                      type: "create",
                    },
                    {
                      text: t("activities.taskCompleted"),
                      time: t("activities.timeAgo.hoursAgo", { count: 6 }),
                      type: "complete",
                    },
                  ].map((activity, index) => (
                    <HStack key={index} gap={3}>
                      <Box
                        w="8px"
                        h="8px"
                        bg={
                          activity.type === "complete"
                            ? "green.400"
                            : activity.type === "create"
                            ? "blue.400"
                            : "orange.400"
                        }
                        borderRadius="full"
                        mt={1}
                      />
                      <Box flex={1}>
                        <Text fontSize="sm" color="gray.700">
                          {activity.text}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {activity.time}
                        </Text>
                      </Box>
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Tips */}
              <Box
                bg="gradient-to-br from-brand.50 to-brand.100"
                p={6}
                borderRadius="2xl"
                border="1px"
                borderColor="brand.200"
              >
                <Text fontSize="lg" fontWeight="bold" color="brand.800" mb={3}>
                  💡 {t("tips.proTip")}
                </Text>
                <Text fontSize="sm" color="brand.700" lineHeight="1.5">
                  {t("tips.keyboardShortcuts", { shortcut: "Ctrl+K" })}
                </Text>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </MainLayout>
  );
};
