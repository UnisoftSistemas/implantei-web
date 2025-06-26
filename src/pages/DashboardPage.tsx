import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Skeleton,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MainLayout } from "@/components/Layout";
import { useAuthStore } from "@/store/authStore";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ProjectCard } from "@/components/Dashboard/ProjectCard";
import { TaskItem } from "@/components/Dashboard/TaskItem";
import { ActivityFeed } from "@/components/Dashboard/ActivityFeed";
import {
  useDashboardStats,
  useDashboardProjects,
  useDashboardTasks,
  useDashboardTimeline,
} from "@/hooks/useDashboard";

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  // Fetch real data from API
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const { data: projects, isLoading: projectsLoading } = useDashboardProjects();
  const { data: tasks, isLoading: tasksLoading } = useDashboardTasks();
  const { data: activities, isLoading: activitiesLoading } =
    useDashboardTimeline();

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

  // Calculate trends for stats (mock calculation for now)
  const getStatsTrend = (current: number, previous: number) => {
    if (previous === 0) return undefined;
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.round(change),
      isPositive: change > 0,
    };
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

        {/* Stats grid with real data */}
        <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
          <GridItem>
            <StatsCard
              title={t("dashboard.activeProjects")}
              value={stats?.activeProjects || 0}
              icon="📋"
              color="blue"
              trend={getStatsTrend(
                stats?.activeProjects || 0,
                stats?.totalProjects || 0
              )}
              isLoading={statsLoading}
            />
          </GridItem>

          <GridItem>
            <StatsCard
              title={t("dashboard.pendingTasks")}
              value={stats?.pendingTasks || 0}
              icon="✅"
              color="orange"
              trend={getStatsTrend(
                stats?.pendingTasks || 0,
                stats?.totalTasks || 0
              )}
              isLoading={statsLoading}
            />
          </GridItem>

          <GridItem>
            <StatsCard
              title={t("dashboard.clientCompanies")}
              value={stats?.totalUsers || 0}
              icon="🏢"
              color="green"
              trend={getStatsTrend(
                stats?.activeUsers || 0,
                stats?.totalUsers || 0
              )}
              isLoading={statsLoading}
            />
          </GridItem>

          <GridItem>
            <StatsCard
              title={t("dashboard.openTickets")}
              value={stats?.overdueTasks || 0}
              icon="🎫"
              color="purple"
              trend={getStatsTrend(
                stats?.overdueTasks || 0,
                stats?.totalTasks || 0
              )}
              isLoading={statsLoading}
            />
          </GridItem>
        </Grid>

        {/* Show error message if stats failed to load */}
        {statsError && (
          <Box
            bg="red.50"
            border="1px"
            borderColor="red.200"
            borderRadius="xl"
            p={4}
          >
            <Text color="red.600" fontSize="sm">
              Erro ao carregar estatísticas. Tente recarregar a página.
            </Text>
          </Box>
        )}

        {/* Content sections */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Main content */}
          <GridItem>
            <VStack gap={6} align="stretch">
              {/* Recent projects with real data */}
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
                    _hover={{ color: "brand.600" }}
                    transition="color 0.2s ease-in-out"
                  >
                    {t("dashboard.seeAll")} →
                  </Text>
                </HStack>

                {projectsLoading ? (
                  <VStack gap={4} align="stretch">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Box key={index} p={4} bg="gray.25" borderRadius="xl">
                        <HStack justify="space-between" mb={2}>
                          <Skeleton w="60%" h="16px" />
                          <Skeleton w="60px" h="20px" borderRadius="full" />
                        </HStack>
                        <Skeleton w="40%" h="12px" />
                      </Box>
                    ))}
                  </VStack>
                ) : projects && projects.length > 0 ? (
                  <VStack gap={4} align="stretch">
                    {projects.slice(0, 3).map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => {
                          // Future: navigate to project details
                          console.log(`Navigate to project ${project.id}`);
                        }}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Text fontSize="sm" color="gray.500">
                      Nenhum projeto encontrado
                    </Text>
                  </Box>
                )}
              </Box>

              {/* My Tasks with real data */}
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
                    Minhas Tarefas
                  </Text>
                  <Text
                    fontSize="sm"
                    color="brand.500"
                    fontWeight="medium"
                    cursor="pointer"
                    _hover={{ color: "brand.600" }}
                    transition="color 0.2s ease-in-out"
                  >
                    Ver todas →
                  </Text>
                </HStack>

                {tasksLoading ? (
                  <VStack gap={3} align="stretch">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Box key={index} p={4} bg="gray.25" borderRadius="xl">
                        <HStack gap={3}>
                          <Skeleton w="16px" h="16px" borderRadius="sm" />
                          <Box flex={1}>
                            <Skeleton w="70%" h="14px" mb={1} />
                            <Skeleton w="40%" h="12px" />
                          </Box>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                ) : tasks && tasks.length > 0 ? (
                  <VStack gap={3} align="stretch">
                    {tasks.slice(0, 5).map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={(taskId) => {
                          // Future: implement task toggle
                          console.log(`Toggle task ${taskId}`);
                        }}
                      />
                    ))}
                  </VStack>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Text fontSize="sm" color="gray.500">
                      Nenhuma tarefa pendente
                    </Text>
                  </Box>
                )}
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
                      onClick: () => console.log("Navigate to new project"),
                    },
                    {
                      icon: "🏢",
                      label: t("dashboard.registerCompany"),
                      color: "green",
                      onClick: () =>
                        console.log("Navigate to register company"),
                    },
                    {
                      icon: "✅",
                      label: t("dashboard.newTask"),
                      color: "orange",
                      onClick: () => console.log("Navigate to new task"),
                    },
                    {
                      icon: "📊",
                      label: t("dashboard.reports"),
                      color: "purple",
                      onClick: () => console.log("Navigate to reports"),
                    },
                  ].map((action, index) => (
                    <HStack
                      key={index}
                      p={3}
                      bg="gray.25"
                      borderRadius="xl"
                      cursor="pointer"
                      _hover={{
                        bg: "gray.50",
                        transform: "translateY(-1px)",
                      }}
                      transition="all 0.2s ease-in-out"
                      onClick={action.onClick}
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

              {/* Activity feed with real data */}
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

                <ActivityFeed
                  activities={activities || []}
                  isLoading={activitiesLoading}
                />
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
