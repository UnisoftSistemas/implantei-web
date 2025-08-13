import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Badge,
  Grid,
  GridItem,
  Skeleton,
  Card,
  createListCollection,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { MainLayout } from "@/components/Layout";
import { ProjectCard } from "@/components/Dashboard/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectModal } from "@/components/Projects/CreateProjectModal";
import { CustomSelect } from "@/components/Common/CustomSelect";

export const ProjectsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch projects with filters
  const {
    data: projects,
    isLoading,
    error,
  } = useProjects({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
    page: 1,
    limit: 20,
  });

  const getStatusCount = (status: string) => {
    if (!projects) return 0;
    return projects.filter((p) => p.status === status).length;
  };

  // Status options with translations
  const statusOptions = createListCollection({
    items: [
      { label: t("filters.allStatuses"), value: "all" },
      { label: t("project.status.planning"), value: "planning" },
      { label: t("project.status.in_progress"), value: "in_progress" },
      { label: t("project.status.validation"), value: "validation" },
      { label: t("project.status.completed"), value: "completed" },
      { label: t("project.status.on_hold"), value: "on_hold" },
      { label: t("project.status.cancelled"), value: "cancelled" },
    ],
  });

  // Priority options with translations
  const priorityOptions = createListCollection({
    items: [
      { label: t("filters.allPriorities"), value: "all" },
      { label: t("task.priority.urgent"), value: "urgent" },
      { label: t("task.priority.high"), value: "high" },
      { label: t("task.priority.medium"), value: "medium" },
      { label: t("task.priority.low"), value: "low" },
    ],
  });

  return (
    <MainLayout>
      <VStack gap={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="start" mb={4}>
            <VStack align="start" gap={1}>
              <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                {t("nav.projects")}
              </Text>
              <Text color="gray.600" fontSize="lg">
                {t("projects.subtitle")}
              </Text>
            </VStack>

            <Button
              bg="brand.600"
              color="white"
              _hover={{ bg: "brand.500" }}
              _active={{ bg: "brand.700" }}
              borderRadius="xl"
              px={6}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={20} /> {t("project.createNew")}
            </Button>
          </HStack>

          {/* Stats cards */}
          <Grid
            templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap={4}
            mb={6}
          >
            {[
              {
                label: t("filters.total"),
                value: projects?.length || 0,
                color: "blue",
                filter: "all",
              },
              {
                label: t("project.status.in_progress"),
                value: getStatusCount("in_progress"),
                color: "blue",
                filter: "in_progress",
              },
              {
                label: t("project.status.planning"),
                value: getStatusCount("planning"),
                color: "orange",
                filter: "planning",
              },
              {
                label: t("project.status.validation"),
                value: getStatusCount("validation"),
                color: "purple",
                filter: "validation",
              },
              {
                label: t("project.status.completed"),
                value: getStatusCount("completed"),
                color: "green",
                filter: "completed",
              },
            ].map((stat, index) => (
              <GridItem key={index}>
                <Card.Root
                  bg="white"
                  borderRadius="xl"
                  border="1px"
                  borderColor="gray.100"
                  cursor="pointer"
                  _hover={{
                    boxShadow: "md",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s ease-in-out"
                  onClick={() => setStatusFilter(stat.filter)}
                >
                  <Card.Body p={4}>
                    <VStack align="start" gap={2}>
                      <HStack justify="space-between" w="full">
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          fontWeight="medium"
                        >
                          {stat.label}
                        </Text>
                        <Badge
                          size="sm"
                          colorScheme={stat.color}
                          variant="subtle"
                          borderRadius="full"
                        >
                          {stat.value}
                        </Badge>
                      </HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {stat.value}
                      </Text>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </GridItem>
            ))}
          </Grid>
        </Box>

        {/* Filters and Search */}
        <Card.Root
          bg="white"
          borderRadius="xl"
          border="1px"
          borderColor="gray.100"
        >
          <Card.Body p={6}>
            <HStack gap={4} wrap="wrap">
              {/* Search */}
              <Box flex={1} minW="300px">
                <HStack>
                  <Search size={20} color="var(--chakra-colors-gray-400)" />
                  <Input
                    placeholder={t("projects.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="subtle"
                    borderRadius="lg"
                    _focus={{ bg: "gray.50" }}
                    fontSize="sm"
                  />
                </HStack>
              </Box>

              {/* Status Filter */}
              <Box minW="150px">
                <CustomSelect
                  collection={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholderKey="filters.status"
                />
              </Box>

              {/* Priority Filter */}
              <Box minW="150px">
                <CustomSelect
                  collection={priorityOptions}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  placeholderKey="filters.priority"
                />
              </Box>

              {/* More filters button */}
              <Button
                variant="ghost"
                size="sm"
                borderRadius="lg"
                _hover={{ bg: "gray.50" }}
              >
                <Filter size={16} /> {t("filters.moreFilters")}
              </Button>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Projects Grid */}
        <Box>
          {error && (
            <Card.Root bg="red.50" borderColor="red.200" mb={6}>
              <Card.Body p={4}>
                <Text color="red.600" fontSize="sm">
                  {t("projects.loadError")}
                </Text>
              </Card.Body>
            </Card.Root>
          )}

          {isLoading ? (
            <Grid
              templateColumns="repeat(auto-fit, minmax(350px, 1fr))"
              gap={6}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <GridItem key={index}>
                  <Card.Root
                    bg="white"
                    borderRadius="xl"
                    border="1px"
                    borderColor="gray.100"
                  >
                    <Card.Body p={5}>
                      <VStack align="stretch" gap={4}>
                        <HStack justify="space-between">
                          <Skeleton w="60%" h="20px" />
                          <Skeleton w="80px" h="24px" borderRadius="full" />
                        </HStack>
                        <Skeleton w="40%" h="16px" />
                        <Box>
                          <Skeleton w="30%" h="12px" mb={2} />
                          <Skeleton w="full" h="8px" borderRadius="full" />
                        </Box>
                        <HStack justify="space-between">
                          <HStack gap={2}>
                            <Skeleton w="24px" h="24px" borderRadius="full" />
                            <Skeleton w="24px" h="24px" borderRadius="full" />
                          </HStack>
                          <Skeleton w="40px" h="12px" />
                        </HStack>
                      </VStack>
                    </Card.Body>
                  </Card.Root>
                </GridItem>
              ))}
            </Grid>
          ) : projects && projects.length > 0 ? (
            <>
              <HStack justify="space-between" mb={4}>
                <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                  {t("projects.resultsCount", {
                    count: projects.length,
                    plural: projects.length !== 1 ? "s" : "",
                  })}
                </Text>

                <Button variant="ghost" size="sm" _hover={{ bg: "gray.50" }}>
                  {t("filters.sortBy")} <MoreHorizontal size={16} />
                </Button>
              </HStack>

              <Grid
                templateColumns="repeat(auto-fit, minmax(350px, 1fr))"
                gap={6}
              >
                {projects.map((project) => (
                  <GridItem key={project.id}>
                    <ProjectCard
                      project={project}
                      onClick={() => {
                        navigate(`/projects/${project.id}`);
                      }}
                    />
                  </GridItem>
                ))}
              </Grid>
            </>
          ) : (
            <Card.Root
              bg="gray.50"
              borderRadius="xl"
              border="2px"
              borderColor="gray.200"
              borderStyle="dashed"
            >
              <Card.Body p={12} textAlign="center">
                <VStack gap={4}>
                  <Box fontSize="4xl">📋</Box>
                  <VStack gap={2}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                      {t("project.noProjects")}
                    </Text>
                    <Text fontSize="sm" color="gray.500" maxW="400px">
                      {searchTerm ||
                      statusFilter !== "all" ||
                      priorityFilter !== "all"
                        ? t("projects.adjustFiltersMessage")
                        : t("projects.createFirstMessage")}
                    </Text>
                  </VStack>

                  {!searchTerm &&
                    statusFilter === "all" &&
                    priorityFilter === "all" && (
                      <Button
                        bg="brand.600"
                        color="white"
                        _hover={{ bg: "brand.500" }}
                        borderRadius="xl"
                        mt={2}
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        <Plus size={20} /> {t("projects.createFirst")}
                      </Button>
                    )}
                </VStack>
              </Card.Body>
            </Card.Root>
          )}
        </Box>

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </VStack>
    </MainLayout>
  );
};
