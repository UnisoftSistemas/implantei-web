import { Box, Text, HStack, VStack, Avatar, Skeleton } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ActivityFeedProps } from "@/types/Activity";

export const ActivityFeed = ({ activities, isLoading }: ActivityFeedProps) => {
  const { t } = useTranslation();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_update":
        return "📋";
      case "task_completed":
        return "✅";
      case "company_created":
        return "🏢";
      case "stage_completed":
        return "🎯";
      case "ticket_created":
        return "🎫";
      default:
        return "📝";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "project_update":
        return "blue.400";
      case "task_completed":
        return "green.400";
      case "company_created":
        return "purple.400";
      case "stage_completed":
        return "orange.400";
      case "ticket_created":
        return "red.400";
      default:
        return "gray.400";
    }
  };

  if (isLoading) {
    return (
      <VStack gap={4} align="stretch">
        {Array.from({ length: 5 }).map((_, index) => (
          <HStack key={index} gap={3}>
            <Skeleton w="8px" h="8px" borderRadius="full" mt={1} />
            <Box flex={1}>
              <Skeleton w="80%" h="16px" mb={1} />
              <Skeleton w="40%" h="12px" />
            </Box>
          </HStack>
        ))}
      </VStack>
    );
  }

  if (!activities.length) {
    return (
      <Box textAlign="center" py={8}>
        <Text fontSize="sm" color="gray.500">
          {t("dashboard.noActivities")}
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={4} align="stretch">
      {activities.map((activity) => (
        <HStack key={activity.id} gap={3} align="start">
          {/* Activity indicator */}
          <Box
            w="8px"
            h="8px"
            bg={getActivityColor(activity.type)}
            borderRadius="full"
            mt={2}
            flexShrink={0}
          />

          {/* Content */}
          <Box flex={1}>
            <HStack gap={2} mb={1} align="start">
              {/* User avatar */}
              {activity.user && (
                <Avatar.Root size="xs">
                  <Avatar.Image src={activity.user.profileImageUrl} />
                  <Avatar.Fallback fontSize="xs">
                    {activity.user.name.charAt(0)}
                  </Avatar.Fallback>
                </Avatar.Root>
              )}

              {/* Activity content */}
              <VStack align="start" gap={0} flex={1}>
                <Text fontSize="sm" color="gray.700" lineHeight="1.4">
                  <Text as="span" fontWeight="medium">
                    {activity.user?.name || "Sistema"}
                  </Text>{" "}
                  {activity.message}
                  {activity.relatedEntity && (
                    <Text as="span" fontWeight="medium" color="brand.600">
                      {" "}
                      {activity.relatedEntity.name}
                    </Text>
                  )}
                </Text>

                <Text fontSize="xs" color="gray.500">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </Text>
              </VStack>

              {/* Activity type icon */}
              <Text fontSize="sm">{getActivityIcon(activity.type)}</Text>
            </HStack>
          </Box>
        </HStack>
      ))}
    </VStack>
  );
};
