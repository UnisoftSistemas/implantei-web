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
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, Activity, TrendingUp } from "lucide-react";
import { apiClient } from "@/services/api";
import type { ApiResponse } from "@/types";

interface SuperAdminStats {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  monthlyRevenue: number;
  growth: {
    tenants: number;
    users: number;
    projects: number;
    revenue: number;
  };
}

interface RecentActivity {
  id: string;
  type: "tenant_created" | "user_registered" | "project_started";
  description: string;
  timestamp: string;
  tenantName?: string;
}

export const SuperAdminDashboard = () => {
  const { t } = useTranslation();

  // Fetch super admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["super-admin-stats"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<SuperAdminStats>>(
        "/admin/stats"
      );
      return response.data;
    },
  });

  // Fetch recent activity
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["super-admin-activities"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<RecentActivity[]>>(
        "/admin/activities"
      );
      return response.data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const isPositive = value > 0;
    return (
      <Text
        fontSize="sm"
        color={isPositive ? "green.600" : "red.600"}
        fontWeight="medium"
      >
        {isPositive ? "↗" : "↘"} {Math.abs(value)}%
      </Text>
    );
  };

  return (
    <VStack gap={8} align="stretch">
      {/* Header */}
      <Box>
        <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
          {t("superAdmin.dashboard.title")}
        </Text>
        <Text color="gray.600" fontSize="lg">
          {t("superAdmin.dashboard.subtitle")}
        </Text>
      </Box>

      {/* Stats Grid */}
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        {/* Total Tenants */}
        <GridItem>
          <Card.Root p={6} bg="white" borderRadius="xl" boxShadow="sm">
            <Card.Body>
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <Building2 size={20} color="blue.500" />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {t("superAdmin.stats.totalTenants")}
                    </Text>
                  </HStack>

                  <VStack align="start" gap={0}>
                    <Skeleton loading={statsLoading} height="32px">
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {stats?.totalTenants || 0}
                      </Text>
                    </Skeleton>

                    <HStack gap={2}>
                      <Badge colorScheme="green" size="sm">
                        {stats?.activeTenants || 0} {t("common.active")}
                      </Badge>
                      {stats?.growth && formatPercentage(stats.growth.tenants)}
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Total Users */}
        <GridItem>
          <Card.Root p={6} bg="white" borderRadius="xl" boxShadow="sm">
            <Card.Body>
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <Users size={20} color="green.500" />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {t("superAdmin.stats.totalUsers")}
                    </Text>
                  </HStack>

                  <VStack align="start" gap={0}>
                    <Skeleton loading={statsLoading} height="32px">
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {stats?.totalUsers || 0}
                      </Text>
                    </Skeleton>

                    <HStack gap={2}>
                      <Text fontSize="sm" color="gray.500">
                        {t("superAdmin.stats.crossAllTenants")}
                      </Text>
                      {stats?.growth && formatPercentage(stats.growth.users)}
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Active Projects */}
        <GridItem>
          <Card.Root p={6} bg="white" borderRadius="xl" boxShadow="sm">
            <Card.Body>
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <Activity size={20} color="purple.500" />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {t("superAdmin.stats.activeProjects")}
                    </Text>
                  </HStack>

                  <VStack align="start" gap={0}>
                    <Skeleton loading={statsLoading} height="32px">
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {stats?.activeProjects || 0}
                      </Text>
                    </Skeleton>

                    <HStack gap={2}>
                      <Text fontSize="sm" color="gray.500">
                        {t("superAdmin.stats.of")} {stats?.totalProjects || 0}{" "}
                        {t("common.total")}
                      </Text>
                      {stats?.growth && formatPercentage(stats.growth.projects)}
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>

        {/* Monthly Revenue */}
        <GridItem>
          <Card.Root p={6} bg="white" borderRadius="xl" boxShadow="sm">
            <Card.Body>
              <HStack justify="space-between" align="start">
                <VStack align="start" gap={2}>
                  <HStack gap={2}>
                    <TrendingUp size={20} color="orange.500" />
                    <Text fontSize="sm" color="gray.600" fontWeight="medium">
                      {t("superAdmin.stats.monthlyRevenue")}
                    </Text>
                  </HStack>

                  <VStack align="start" gap={0}>
                    <Skeleton loading={statsLoading} height="32px">
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {formatCurrency(stats?.monthlyRevenue || 0)}
                      </Text>
                    </Skeleton>

                    <HStack gap={2}>
                      <Text fontSize="sm" color="gray.500">
                        {t("superAdmin.stats.thisMonth")}
                      </Text>
                      {stats?.growth && formatPercentage(stats.growth.revenue)}
                    </HStack>
                  </VStack>
                </VStack>
              </HStack>
            </Card.Body>
          </Card.Root>
        </GridItem>
      </Grid>

      {/* Recent Activity */}
      <Card.Root bg="white" borderRadius="xl" boxShadow="sm">
        <Card.Header pb={4}>
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            {t("superAdmin.activity.title")}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {t("superAdmin.activity.subtitle")}
          </Text>
        </Card.Header>

        <Card.Body>
          <VStack gap={4} align="stretch">
            {activitiesLoading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height="60px" borderRadius="md" />
              ))
            ) : activities && activities.length > 0 ? (
              activities.map((activity) => (
                <HStack
                  key={activity.id}
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  justify="space-between"
                >
                  <VStack align="start" gap={1}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.800">
                      {activity.description}
                    </Text>
                    {activity.tenantName && (
                      <Badge size="sm" colorScheme="blue" variant="subtle">
                        {activity.tenantName}
                      </Badge>
                    )}
                  </VStack>

                  <Text fontSize="xs" color="gray.500">
                    {new Date(activity.timestamp).toLocaleDateString("pt-BR")}
                  </Text>
                </HStack>
              ))
            ) : (
              <Text color="gray.500" textAlign="center" py={8}>
                {t("superAdmin.activity.noActivity")}
              </Text>
            )}
          </VStack>
        </Card.Body>
      </Card.Root>

      {/* Quick Actions */}
      <Card.Root bg="white" borderRadius="xl" boxShadow="sm">
        <Card.Header pb={4}>
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            {t("superAdmin.quickActions.title")}
          </Text>
        </Card.Header>

        <Card.Body>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <Button size="lg" colorScheme="blue" variant="outline">
              <Building2 size={20} /> {t("superAdmin.actions.manageTenants")}
            </Button>

            <Button size="lg" colorScheme="green" variant="outline">
              <Users size={20} /> {t("superAdmin.actions.manageUsers")}
            </Button>

            <Button size="lg" colorScheme="purple" variant="outline">
              <Activity size={20} /> {t("superAdmin.actions.viewReports")}
            </Button>
          </Grid>
        </Card.Body>
      </Card.Root>
    </VStack>
  );
};
