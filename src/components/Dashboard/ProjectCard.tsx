import {
  Box,
  Text,
  HStack,
  VStack,
  Badge,
  Avatar,
  Progress,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ProjectCardProps } from "@/types";

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const { t } = useTranslation();

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

  // Calculate progress based on project status (mock calculation)
  const getProgress = () => {
    switch (project.status) {
      case "planning":
        return 10;
      case "in_progress":
        return 65;
      case "validation":
        return 85;
      case "completed":
        return 100;
      case "on_hold":
        return 40;
      case "cancelled":
        return 0;
      default:
        return 0;
    }
  };

  const progress = getProgress();

  return (
    <Box
      bg="white"
      p={5}
      borderRadius="xl"
      border="1px"
      borderColor="gray.100"
      boxShadow="sm"
      _hover={{
        boxShadow: "md",
        transform: "translateY(-1px)",
      }}
      transition="all 0.2s ease-in-out"
      cursor="pointer"
      onClick={onClick}
    >
      <VStack align="stretch" gap={4}>
        {/* Header */}
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1} flex={1}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="gray.800"
              lineHeight="1.3"
            >
              {project.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {project.company?.name}
            </Text>
          </VStack>

          <VStack align="end" gap={1}>
            <Badge
              size="sm"
              colorScheme={getStatusColor(project.status)}
              variant="subtle"
              borderRadius="full"
            >
              {t(`project.status.${project.status}`)}
            </Badge>
            <Badge
              size="xs"
              colorScheme={getPriorityColor(project.priority)}
              variant="outline"
            >
              {project.priority}
            </Badge>
          </VStack>
        </HStack>

        {/* Progress */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="xs" color="gray.600">
              {t("project.progress")}
            </Text>
            <Text fontSize="xs" color="gray.600" fontWeight="medium">
              {progress}%
            </Text>
          </HStack>
          <Progress.Root
            value={progress}
            size="sm"
            borderRadius="full"
            colorScheme={getStatusColor(project.status)}
          >
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </Box>

        {/* Footer */}
        <HStack justify="space-between" align="center">
          <HStack gap={3}>
            {/* Team */}
            <HStack gap={1}>
              <Users size={12} color="var(--chakra-colors-gray-500)" />
              <Avatar.Root size="xs">
                <Avatar.Image src={project.consultant?.profileImageUrl} />
                <Avatar.Fallback fontSize="xs">
                  {project.consultant?.name.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root size="xs">
                <Avatar.Image src={project.manager?.profileImageUrl} />
                <Avatar.Fallback fontSize="xs">
                  {project.manager?.name.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>
            </HStack>
          </HStack>

          {/* Date */}
          {project.estimatedEndDate && (
            <HStack gap={1}>
              <Calendar size={12} color="var(--chakra-colors-gray-500)" />
              <Text fontSize="xs" color="gray.500">
                {format(new Date(project.estimatedEndDate), "dd/MM", {
                  locale: ptBR,
                })}
              </Text>
            </HStack>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};
