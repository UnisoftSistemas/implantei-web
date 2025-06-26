import { Box, Text, HStack, Badge, Skeleton } from "@chakra-ui/react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export const StatsCard = ({
  title,
  value,
  icon,
  color,
  trend,
  isLoading,
}: StatsCardProps) => {
  if (isLoading) {
    return (
      <Box
        bg="white"
        p={6}
        borderRadius="2xl"
        border="1px"
        borderColor="gray.100"
        boxShadow="sm"
      >
        <HStack justify="space-between" mb={4}>
          <Skeleton w="48px" h="48px" borderRadius="xl" />
          <Skeleton w="60px" h="24px" borderRadius="full" />
        </HStack>

        <Skeleton w="80px" h="32px" mb={2} />
        <Skeleton w="120px" h="16px" />
      </Box>
    );
  }

  return (
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
      cursor="pointer"
    >
      <HStack justify="space-between" mb={4}>
        <Box
          w="48px"
          h="48px"
          bg={`${color}.50`}
          borderRadius="xl"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xl">{icon}</Text>
        </Box>

        {trend && (
          <Badge
            colorScheme={trend.isPositive ? "green" : "red"}
            variant="subtle"
            borderRadius="full"
            px={3}
            display="flex"
            alignItems="center"
            gap={1}
          >
            {trend.isPositive ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </Badge>
        )}
      </HStack>

      <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={1}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </Text>
      <Text fontSize="sm" color="gray.600">
        {title}
      </Text>
    </Box>
  );
};
