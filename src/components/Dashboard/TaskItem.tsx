import {
  Box,
  Text,
  HStack,
  Badge,
  Avatar,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { Clock, AlertCircle } from "lucide-react";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { TaskItemProps } from "@/types";

export const TaskItem = ({ task, onToggle }: TaskItemProps) => {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "validation":
        return "🔍";
      case "follow_up":
        return "📞";
      case "client":
        return "👥";
      case "internal":
        return "🔧";
      default:
        return "📋";
    }
  };

  const isOverdue = task.dueDate
    ? isPast(new Date(task.dueDate)) && task.status !== "completed"
    : false;
  const isCompleted = task.status === "completed";

  return (
    <Box
      p={4}
      bg="gray.25"
      borderRadius="xl"
      border="1px"
      borderColor={isOverdue ? "red.200" : "gray.100"}
      _hover={{ bg: "gray.50" }}
      transition="all 0.2s ease-in-out"
    >
      <HStack gap={3} align="start">
        {/* Checkbox */}
        <Checkbox.Root
          checked={isCompleted}
          onCheckedChange={() => onToggle?.(task.id)}
          colorPalette={isCompleted ? "green" : "brand"}
          size="sm"
          mt={1}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
        </Checkbox.Root>

        {/* Content */}
        <Box flex={1}>
          <HStack justify="space-between" align="start" mb={2}>
            <VStack align="start" gap={1} flex={1}>
              <HStack gap={2}>
                <Text fontSize="xs">{getTypeIcon(task.type)}</Text>
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  color={isCompleted ? "gray.500" : "gray.800"}
                  textDecoration={isCompleted ? "line-through" : "none"}
                  lineHeight="1.3"
                >
                  {task.title}
                </Text>
              </HStack>

              {task.project && (
                <Text fontSize="xs" color="gray.500">
                  {task.project.name}
                </Text>
              )}
            </VStack>

            <VStack align="end" gap={1}>
              <Badge
                size="xs"
                colorScheme={getPriorityColor(task.priority)}
                variant="subtle"
              >
                {task.priority}
              </Badge>

              {isOverdue && (
                <Badge size="xs" colorScheme="red" variant="solid">
                  <AlertCircle size={8} />
                </Badge>
              )}
            </VStack>
          </HStack>

          {/* Footer */}
          <HStack justify="space-between" align="center">
            {/* Assignee */}
            <HStack gap={2}>
              <Avatar.Root size="xs">
                <Avatar.Image src={task.assignee?.profileImageUrl} />
                <Avatar.Fallback fontSize="xs">
                  {task.assignee?.name.charAt(0)}
                </Avatar.Fallback>
              </Avatar.Root>
              <Text fontSize="xs" color="gray.500">
                {task.assignee?.name}
              </Text>
            </HStack>

            {/* Due date */}
            {task.dueDate && (
              <HStack gap={1}>
                <Clock
                  size={10}
                  color={
                    isOverdue
                      ? "var(--chakra-colors-red-500)"
                      : "var(--chakra-colors-gray-500)"
                  }
                />
                <Text
                  fontSize="xs"
                  color={isOverdue ? "red.500" : "gray.500"}
                  fontWeight={isOverdue ? "medium" : "normal"}
                >
                  {format(new Date(task.dueDate), "dd/MM", { locale: ptBR })}
                </Text>
              </HStack>
            )}
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};
