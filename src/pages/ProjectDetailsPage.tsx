import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Grid,
  GridItem,
  Progress,
  Avatar,
  Card,
  Tabs,
  Skeleton,
  Separator,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { MainLayout } from "@/components/Layout";
import { useProject, useProjectStages } from "@/hooks/useProjects";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { ActivityFeed } from "@/components/Dashboard/ActivityFeed";
import type { ProjectStage } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const ProjectDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch project data
  const {
    data: project,
    isLoading: projectLoading,
    error: projectError,
  } = useProject(id!);
  const { data: stages, isLoading: stagesLoading } = useProjectStages(id!);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "orange";
      case "in_progress":
        return "blue";
      case "validation":
        return "purple";
      case "completed":
        return "green";
      case "on_hold":
        return "yellow";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "blue";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "gray";
      case "in_progress":
        return "blue";
      case "validation":
        return "purple";
      case "completed":
        return "green";
      case "skipped":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getProgressPercentage = () => {
    if (!stages || stages.length === 0) return 0;
    const completedStages = stages.filter(
      (stage: ProjectStage) => stage.status === "completed"
    ).length;
    return Math.round((completedStages / stages.length) * 100);
  };

  if (projectError) {
    return (
      <MainLayout>
        <Card.Root bg="red.50" borderColor="red.200">
          <Card.Body p={6} textAlign="center">
            <VStack gap={4}>
              <AlertCircle size={48} color="var(--chakra-colors-red-500)" />
              <VStack gap={2}>
                <Text fontSize="lg" fontWeight="semibold" color="red.700">
                  {t("project.loadError")}
                </Text>
                <Text fontSize="sm" color="red.600">
                  {t("project.loadErrorMessage")}
                </Text>
              </VStack>
              <Button
                onClick={() => navigate("/projects")}
                variant="outline"
                colorScheme="red"
              >
                {t("common.goBack")}
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack gap={4} mb={6}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/projects")}
              _hover={{ bg: "gray.100" }}
            >
              <ArrowLeft size={16} /> {t("common.back")}
            </Button>
          </HStack>

          {projectLoading ? (
            <VStack align="start" gap={4}>
              <Skeleton w="300px" h="36px" />
              <Skeleton w="200px" h="20px" />
              <HStack gap={4}>
                <Skeleton w="100px" h="24px" borderRadius="full" />
                <Skeleton w="80px" h="24px" borderRadius="full" />
              </HStack>
            </VStack>
          ) : project ? (
            <Box>
              <HStack justify="space-between" align="start" mb={4}>
                <VStack align="start" gap={2}>
                  <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                    {project.name}
                  </Text>
                  <Text color="gray.600" fontSize="lg">
                    {project.company?.name}
                  </Text>
                  <HStack gap={3}>
                    <Badge
                      size="md"
                      colorScheme={getStatusColor(project.status)}
                      variant="subtle"
                      borderRadius="full"
                      px={3}
                    >
                      {t(`project.status.${project.status}`)}
                    </Badge>
                    <Badge
                      size="md"
                      colorScheme={getPriorityColor(project.priority)}
                      variant="outline"
                      borderRadius="full"
                      px={3}
                    >
                      {t(`task.priority.${project.priority}`)}
                    </Badge>
                  </HStack>
                </VStack>

                <HStack gap={2}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Future: open edit modal
                      console.log("Edit project");
                    }}
                  >
                    <Edit size={16} /> {t("project.edit")}
                  </Button>
                  <Button variant="ghost" size="sm" _hover={{ bg: "gray.100" }}>
                    <MoreHorizontal size={16} />
                  </Button>
                </HStack>
              </HStack>

              {/* Progress bar */}
              <Box mb={6}>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    {t("project.progress")}
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    {getProgressPercentage()}%
                  </Text>
                </HStack>
                <Progress.Root
                  value={getProgressPercentage()}
                  size="md"
                  borderRadius="full"
                  colorScheme={getStatusColor(project.status)}
                >
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              </Box>
            </Box>
          ) : null}
        </Box>

        {/* Stats Cards */}
        {!projectLoading && project && (
          <Grid templateColumns="repeat(auto-fit, minmax(240px, 1fr))" gap={6}>
            <GridItem>
              <StatsCard
                title={t("project.totalStages")}
                value={stages?.length || 0}
                icon="📋"
                color="blue"
                isLoading={stagesLoading}
              />
            </GridItem>
            <GridItem>
              <StatsCard
                title={t("project.completedStages")}
                value={
                  stages?.filter((s: ProjectStage) => s.status === "completed")
                    .length || 0
                }
                icon="✅"
                color="green"
                isLoading={stagesLoading}
              />
            </GridItem>
            <GridItem>
              <StatsCard
                title={t("project.daysElapsed")}
                value={
                  project.startDate
                    ? Math.floor(
                        (new Date().getTime() -
                          new Date(project.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0
                }
                icon="📅"
                color="purple"
              />
            </GridItem>
            <GridItem>
              <StatsCard
                title={t("project.budget")}
                value={
                  project.budget
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(project.budget)
                    : t("common.notDefined")
                }
                icon="💰"
                color="orange"
              />
            </GridItem>
          </Grid>
        )}

        {/* Main Content */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Left Column - Tabs */}
          <GridItem>
            <Tabs.Root defaultValue="overview" variant="enclosed">
              <Tabs.List>
                <Tabs.Trigger value="overview">
                  {t("project.overview")}
                </Tabs.Trigger>
                <Tabs.Trigger value="stages">
                  {t("project.stages")}
                </Tabs.Trigger>
                <Tabs.Trigger value="tasks">{t("project.tasks")}</Tabs.Trigger>
                <Tabs.Trigger value="timeline">
                  {t("project.timeline")}
                </Tabs.Trigger>
              </Tabs.List>

              {/* Overview Tab */}
              <Tabs.Content value="overview">
                <Card.Root
                  bg="white"
                  borderRadius="xl"
                  border="1px"
                  borderColor="gray.100"
                >
                  <Card.Body p={6}>
                    {projectLoading ? (
                      <VStack align="stretch" gap={4}>
                        <Skeleton w="full" h="16px" />
                        <Skeleton w="80%" h="16px" />
                        <Skeleton w="60%" h="16px" />
                      </VStack>
                    ) : (
                      <VStack align="stretch" gap={6}>
                        {/* Description */}
                        {project?.description && (
                          <Box>
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color="gray.700"
                              mb={2}
                            >
                              {t("project.description")}
                            </Text>
                            <Text
                              fontSize="sm"
                              color="gray.600"
                              lineHeight="1.6"
                            >
                              {project.description}
                            </Text>
                          </Box>
                        )}

                        <Separator />

                        {/* Project Details Grid */}
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                          <VStack align="start" gap={4}>
                            <Box>
                              <Text
                                fontSize="xs"
                                fontWeight="medium"
                                color="gray.500"
                                mb={1}
                              >
                                {t("project.startDate")}
                              </Text>
                              <HStack gap={2}>
                                <Calendar
                                  size={14}
                                  color="var(--chakra-colors-gray-500)"
                                />
                                <Text fontSize="sm" color="gray.700">
                                  {project?.startDate
                                    ? format(
                                        new Date(project.startDate),
                                        "dd/MM/yyyy",
                                        { locale: ptBR }
                                      )
                                    : t("common.notDefined")}
                                </Text>
                              </HStack>
                            </Box>

                            <Box>
                              <Text
                                fontSize="xs"
                                fontWeight="medium"
                                color="gray.500"
                                mb={1}
                              >
                                {t("project.estimatedEndDate")}
                              </Text>
                              <HStack gap={2}>
                                <Clock
                                  size={14}
                                  color="var(--chakra-colors-gray-500)"
                                />
                                <Text fontSize="sm" color="gray.700">
                                  {project?.estimatedEndDate
                                    ? format(
                                        new Date(project.estimatedEndDate),
                                        "dd/MM/yyyy",
                                        { locale: ptBR }
                                      )
                                    : t("common.notDefined")}
                                </Text>
                              </HStack>
                            </Box>
                          </VStack>

                          <VStack align="start" gap={4}>
                            <Box>
                              <Text
                                fontSize="xs"
                                fontWeight="medium"
                                color="gray.500"
                                mb={1}
                              >
                                {t("project.consultant")}
                              </Text>
                              <HStack gap={2}>
                                <Avatar.Root size="xs">
                                  <Avatar.Image
                                    src={project?.consultant?.profileImageUrl}
                                  />
                                  <Avatar.Fallback fontSize="xs">
                                    {project?.consultant?.name.charAt(0)}
                                  </Avatar.Fallback>
                                </Avatar.Root>
                                <Text fontSize="sm" color="gray.700">
                                  {project?.consultant?.name ||
                                    t("common.notAssigned")}
                                </Text>
                              </HStack>
                            </Box>

                            <Box>
                              <Text
                                fontSize="xs"
                                fontWeight="medium"
                                color="gray.500"
                                mb={1}
                              >
                                {t("project.manager")}
                              </Text>
                              <HStack gap={2}>
                                <Avatar.Root size="xs">
                                  <Avatar.Image
                                    src={project?.manager?.profileImageUrl}
                                  />
                                  <Avatar.Fallback fontSize="xs">
                                    {project?.manager?.name.charAt(0)}
                                  </Avatar.Fallback>
                                </Avatar.Root>
                                <Text fontSize="sm" color="gray.700">
                                  {project?.manager?.name ||
                                    t("common.notAssigned")}
                                </Text>
                              </HStack>
                            </Box>
                          </VStack>
                        </Grid>
                      </VStack>
                    )}
                  </Card.Body>
                </Card.Root>
              </Tabs.Content>

              {/* Stages Tab */}
              <Tabs.Content value="stages">
                <Card.Root
                  bg="white"
                  borderRadius="xl"
                  border="1px"
                  borderColor="gray.100"
                >
                  <Card.Body p={6}>
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.800"
                      mb={4}
                    >
                      {t("project.projectStages")}
                    </Text>

                    {stagesLoading ? (
                      <VStack gap={4} align="stretch">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <Box key={index} p={4} bg="gray.25" borderRadius="xl">
                            <HStack justify="space-between" mb={2}>
                              <Skeleton w="60%" h="16px" />
                              <Skeleton w="80px" h="20px" borderRadius="full" />
                            </HStack>
                            <Skeleton w="40%" h="12px" />
                          </Box>
                        ))}
                      </VStack>
                    ) : stages && stages.length > 0 ? (
                      <VStack gap={4} align="stretch">
                        {stages.map((stage: ProjectStage, index: number) => (
                          <Box
                            key={stage.id}
                            p={4}
                            bg="gray.25"
                            borderRadius="xl"
                            border="1px"
                            borderColor="gray.100"
                          >
                            <HStack justify="space-between" mb={2}>
                              <HStack gap={3}>
                                <Box
                                  w="24px"
                                  h="24px"
                                  bg={
                                    stage.status === "completed"
                                      ? "green.500"
                                      : "gray.300"
                                  }
                                  borderRadius="full"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  {stage.status === "completed" ? (
                                    <CheckCircle size={16} color="white" />
                                  ) : (
                                    <Text
                                      fontSize="xs"
                                      color="white"
                                      fontWeight="bold"
                                    >
                                      {index + 1}
                                    </Text>
                                  )}
                                </Box>
                                <VStack align="start" gap={0}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="gray.800"
                                  >
                                    {stage.name}
                                  </Text>
                                  {stage.description && (
                                    <Text fontSize="xs" color="gray.600">
                                      {stage.description}
                                    </Text>
                                  )}
                                </VStack>
                              </HStack>
                              <Badge
                                size="sm"
                                colorScheme={getStageStatusColor(stage.status)}
                                variant="subtle"
                                borderRadius="full"
                              >
                                {t(`project.stageStatus.${stage.status}`)}
                              </Badge>
                            </HStack>

                            {stage.plannedHours && (
                              <HStack gap={4} mt={2}>
                                <Text fontSize="xs" color="gray.500">
                                  {t("project.plannedHours")}:{" "}
                                  {stage.plannedHours}h
                                </Text>
                                {stage.actualHours && (
                                  <Text fontSize="xs" color="gray.500">
                                    {t("project.actualHours")}:{" "}
                                    {stage.actualHours}h
                                  </Text>
                                )}
                              </HStack>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Box textAlign="center" py={8}>
                        <Text fontSize="sm" color="gray.500">
                          {t("project.noStages")}
                        </Text>
                      </Box>
                    )}
                  </Card.Body>
                </Card.Root>
              </Tabs.Content>

              {/* Tasks Tab */}
              <Tabs.Content value="tasks">
                <Card.Root
                  bg="white"
                  borderRadius="xl"
                  border="1px"
                  borderColor="gray.100"
                >
                  <Card.Body p={6}>
                    <HStack justify="space-between" mb={4}>
                      <Text
                        fontSize="lg"
                        fontWeight="semibold"
                        color="gray.800"
                      >
                        {t("project.projectTasks")}
                      </Text>
                      <Button size="sm" variant="outline">
                        {t("task.createNew")}
                      </Button>
                    </HStack>

                    <Box textAlign="center" py={8}>
                      <Text fontSize="sm" color="gray.500">
                        {t("task.noTasks")}
                      </Text>
                    </Box>
                  </Card.Body>
                </Card.Root>
              </Tabs.Content>

              {/* Timeline Tab */}
              <Tabs.Content value="timeline">
                <Card.Root
                  bg="white"
                  borderRadius="xl"
                  border="1px"
                  borderColor="gray.100"
                >
                  <Card.Body p={6}>
                    <Text
                      fontSize="lg"
                      fontWeight="semibold"
                      color="gray.800"
                      mb={4}
                    >
                      {t("project.activityTimeline")}
                    </Text>

                    <ActivityFeed activities={[]} isLoading={false} />
                  </Card.Body>
                </Card.Root>
              </Tabs.Content>
            </Tabs.Root>
          </GridItem>

          {/* Right Column - Sidebar */}
          <GridItem>
            <VStack gap={6} align="stretch">
              {/* Team Card */}
              <Card.Root
                bg="white"
                borderRadius="xl"
                border="1px"
                borderColor="gray.100"
              >
                <Card.Body p={6}>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.800"
                    mb={4}
                  >
                    {t("project.team")}
                  </Text>

                  {projectLoading ? (
                    <VStack gap={3}>
                      {Array.from({ length: 2 }).map((_, index) => (
                        <HStack key={index} gap={3}>
                          <Skeleton w="32px" h="32px" borderRadius="full" />
                          <Box flex={1}>
                            <Skeleton w="60%" h="14px" mb={1} />
                            <Skeleton w="40%" h="12px" />
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  ) : (
                    <VStack gap={3} align="stretch">
                      {project?.consultant && (
                        <HStack gap={3}>
                          <Avatar.Root size="sm">
                            <Avatar.Image
                              src={project.consultant.profileImageUrl}
                            />
                            <Avatar.Fallback>
                              {project.consultant.name.charAt(0)}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <VStack align="start" gap={0} flex={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.800"
                            >
                              {project.consultant.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {t("user.roles.consultant")}
                            </Text>
                          </VStack>
                        </HStack>
                      )}

                      {project?.manager && (
                        <HStack gap={3}>
                          <Avatar.Root size="sm">
                            <Avatar.Image
                              src={project.manager.profileImageUrl}
                            />
                            <Avatar.Fallback>
                              {project.manager.name.charAt(0)}
                            </Avatar.Fallback>
                          </Avatar.Root>
                          <VStack align="start" gap={0} flex={1}>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.800"
                            >
                              {project.manager.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {t("user.roles.manager")}
                            </Text>
                          </VStack>
                        </HStack>
                      )}
                    </VStack>
                  )}
                </Card.Body>
              </Card.Root>

              {/* Quick Actions */}
              <Card.Root
                bg="white"
                borderRadius="xl"
                border="1px"
                borderColor="gray.100"
              >
                <Card.Body p={6}>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.800"
                    mb={4}
                  >
                    {t("dashboard.quickActions")}
                  </Text>

                  <VStack gap={3} align="stretch">
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      _hover={{ bg: "gray.50" }}
                    >
                      📝 {t("project.addNote")}
                    </Button>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      _hover={{ bg: "gray.50" }}
                    >
                      📎 {t("project.uploadFile")}
                    </Button>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      _hover={{ bg: "gray.50" }}
                    >
                      📧 {t("project.sendUpdate")}
                    </Button>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      _hover={{ bg: "gray.50" }}
                    >
                      📊 {t("project.generateReport")}
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </MainLayout>
  );
};
