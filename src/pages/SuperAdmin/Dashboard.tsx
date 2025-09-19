import {
  Box,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  Badge,
  Button,
  Skeleton,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from "lucide-react";
// Import custom super admin hooks
import {
  useSuperAdminStats,
  useSuperAdminTimeline,
} from "@/hooks/useSuperAdminDashboard";

export const SuperAdminDashboard = () => {
  const { t } = useTranslation();

  // Mock navigation function for artifact demo
  const handleNavigation = (path: string) => {
    console.log(`Navigate to: ${path}`);
  };

  // Use super admin specific hooks
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useSuperAdminStats();

  const { data: activities, isLoading: activitiesLoading } =
    useSuperAdminTimeline();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number, showSign = true) => {
    const isPositive = value > 0;
    const prefix = showSign && isPositive ? "+" : "";
    return (
      <Text
        fontSize="sm"
        color={isPositive ? "green.600" : value < 0 ? "red.600" : "gray.600"}
        fontWeight="medium"
        display="inline"
      >
        {prefix}
        {value.toFixed(1)}%
      </Text>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "tenant_created":
        return <Building2 size={16} />;
      case "user_registered":
        return <Users size={16} />;
      case "project_started":
      case "project_completed":
        return <Activity size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <VStack gap={8} align="stretch" w="full">
      {/* Header */}
      <Box>
        <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
          {t("superAdmin.dashboard.title")}
        </Text>
        <Text fontSize="lg" color="gray.600">
          {t("superAdmin.dashboard.subtitle")}
        </Text>
      </Box>

      {/* Stats Cards Grid */}
      <Grid templateColumns="repeat(auto-fit, minmax(280px, 1fr))" gap={6}>
        {/* Total Companies */}
        <GridItem>
          <Card.Root bg="white" borderRadius="xl" boxShadow="sm" p={6}>
            <Card.Body>
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={3}>
                  <HStack gap={2}>
                    <Building2 size={20} color="#3182ce" />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {t("superAdmin.stats.totalTenants")}
                    </Text>
                  </HStack>

                  <VStack align="start" gap={1}>
                    <Skeleton
                      loading={statsLoading}
                      height="36px"
                      width="100px"
                    >
                      <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                        {stats?.totalTenants || 0}
                      </Text>
                    </Skeleton>

                    <HStack gap={2} align="center">
                      <Badge size="sm" colorScheme="green" variant="subtle">
                        {stats?.activeTenants || 0} {t("common.active")}
                      </Badge>
                      {stats?.tenantGrowth !== undefined && (
                        <HStack gap={1}>
                          <TrendingUp size={12} color="#38a169" />
                          {formatPercentage(stats.tenantGrowth)}
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Total Users */}
        <GridItem>
          <Card.Root bg="white" borderRadius="xl" boxShadow="sm" p={6}>
            <Card.Body>
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={3}>
                  <HStack gap={2}>
                    <Users size={20} color="#38a169" />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {t("superAdmin.stats.totalUsers")}
                    </Text>
                  </HStack>

                  <VStack align="start" gap={1}>
                    <Skeleton
                      loading={statsLoading}
                      height="36px"
                      width="100px"
                    >
                      <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                        {stats?.totalUsers || 0}
                      </Text>
                    </Skeleton>

                    <HStack gap={2} align="center">
                      <Text fontSize="sm" color="gray.500">
                        {t("superAdmin.stats.crossAllTenants")}
                      </Text>
                      {stats?.userGrowth !== undefined && (
                        <HStack gap={1}>
                          <TrendingUp size={12} color="#38a169" />
                          {formatPercentage(stats.userGrowth)}
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Active Projects */}
        <GridItem>
          <Card.Root bg="white" borderRadius="xl" boxShadow="sm" p={6}>
            <Card.Body>
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={3}>
                  <HStack gap={2}>
                    <Activity size={20} color="#805ad5" />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {t("superAdmin.stats.activeProjects")}
                    </Text>
                  </HStack>

                  <VStack align="start" gap={1}>
                    <Skeleton
                      loading={statsLoading}
                      height="36px"
                      width="100px"
                    >
                      <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                        {stats?.activeProjects || 0}
                      </Text>
                    </Skeleton>

                    <Text fontSize="sm" color="gray.500">
                      {t("superAdmin.stats.of")} {stats?.totalProjects || 0}{" "}
                      {t("common.total")}
                    </Text>
                  </VStack>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Monthly Revenue */}
        <GridItem>
          <Card.Root bg="white" borderRadius="xl" boxShadow="sm" p={6}>
            <Card.Body>
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={3}>
                  <HStack gap={2}>
                    <DollarSign size={20} color="#d69e2e" />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {t("superAdmin.stats.monthlyRevenue")}
                    </Text>
                  </HStack>

                  <VStack align="start" gap={1}>
                    <Skeleton
                      loading={statsLoading}
                      height="36px"
                      width="120px"
                    >
                      <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                        {formatCurrency(stats?.monthlyRevenue || 0)}
                      </Text>
                    </Skeleton>

                    <HStack gap={2} align="center">
                      <Text fontSize="sm" color="gray.500">
                        {t("superAdmin.stats.thisMonth")}
                      </Text>
                      {stats?.revenueGrowth !== undefined && (
                        <HStack gap={1}>
                          <TrendingUp size={12} color="#38a169" />
                          {formatPercentage(stats.revenueGrowth)}
                        </HStack>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>
      </Grid>

      {/* Bottom Section - Recent Activity & Quick Actions */}
      <Grid templateColumns="2fr 1fr" gap={6}>
        {/* Recent Activity */}
        <GridItem>
          <Card.Root bg="white" borderRadius="xl" boxShadow="sm">
            <Card.Header>
              <VStack align="start" gap={1}>
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                  {t("superAdmin.activity.title")}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {t("superAdmin.activity.subtitle")}
                </Text>
              </VStack>
            </Card.Header>

            <Card.Body>
              <VStack gap={3} align="stretch">
                {activitiesLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} height="60px" borderRadius="md" />
                  ))
                ) : activities && activities.length > 0 ? (
                  activities.slice(0, 8).map((activity) => (
                    <HStack
                      key={activity.id}
                      p={4}
                      bg="gray.50"
                      borderRadius="md"
                      justify="space-between"
                    >
                      <HStack gap={3}>
                        <Box color="gray.600">
                          {getActivityIcon(activity.type)}
                        </Box>

                        <VStack align="start" gap={0.5}>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.800"
                          >
                            {activity.description}
                          </Text>

                          <HStack gap={2}>
                            {activity.tenantName && (
                              <Badge
                                size="sm"
                                colorScheme="blue"
                                variant="subtle"
                              >
                                {activity.tenantName}
                              </Badge>
                            )}
                            {activity.userName && (
                              <Text fontSize="xs" color="gray.500">
                                por {activity.userName}
                              </Text>
                            )}
                          </HStack>
                        </VStack>
                      </HStack>

                      <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
                        {new Date(activity.timestamp).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </HStack>
                  ))
                ) : (
                  <Box textAlign="center" py={12}>
                    <Text color="gray.500" fontSize="sm">
                      {t("superAdmin.activity.noActivity")}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Quick Actions */}
        <GridItem>
          <Card.Root bg="white" borderRadius="xl" boxShadow="sm">
            <Card.Header>
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                {t("superAdmin.quickActions.title")}
              </Text>
            </Card.Header>

            <Card.Body>
              <VStack gap={4} align="stretch">
                <Button
                  size="lg"
                  colorScheme="blue"
                  variant="solid"
                  onClick={() => handleNavigation("/super-admin/tenants")}
                  w="full"
                  justifyContent="flex-start"
                >
                  <Building2 size={18} />{" "}
                  {t("superAdmin.actions.manageTenants")}
                </Button>

                <Button
                  size="lg"
                  colorScheme="green"
                  variant="solid"
                  onClick={() => handleNavigation("/super-admin/users")}
                  w="full"
                  justifyContent="flex-start"
                >
                  <Users size={18} /> {t("superAdmin.actions.manageUsers")}
                </Button>

                <Button
                  size="lg"
                  colorScheme="purple"
                  variant="outline"
                  onClick={() => handleNavigation("/super-admin/reports")}
                  w="full"
                  justifyContent="flex-start"
                >
                  <TrendingUp size={18} /> {t("superAdmin.actions.viewReports")}
                </Button>

                {/* Error state for stats loading */}
                {statsError && (
                  <Box
                    p={4}
                    bg="red.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="red.200"
                  >
                    <HStack gap={2}>
                      <AlertCircle size={16} color="#e53e3e" />
                      <Text fontSize="sm" color="red.700">
                        Erro ao carregar estatísticas
                      </Text>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Card.Body>
          </Card.Root>
        </GridItem>
      </Grid>
    </VStack>
  );
};
