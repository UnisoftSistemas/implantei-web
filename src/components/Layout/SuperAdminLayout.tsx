import { Box, HStack, Badge } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.25">
      <HStack gap={0} align="stretch" minH="100vh">
        <Sidebar />
        {/* Main content area */}
        <Box flex={1} display="flex" flexDirection="column" bg="gray.25">
          {/* Header with Super Admin indicator */}
          <Box position="relative">
            <Header />
            {/* Super Admin overlay badge */}
            <Box position="absolute" top={2} right={2} zIndex={10}>
              <Badge colorScheme="red" variant="solid" fontSize="xs">
                SUPER ADMIN MODE
              </Badge>
            </Box>
          </Box>

          {/* Main content */}
          <Box flex={1} p={8} bg="gray.25" position="relative" overflow="auto">
            {/* Background decoration */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              opacity="0.02"
              pointerEvents="none"
              bg="radial-gradient(circle at 25% 25%, red.500 1px, transparent 1px)"
              backgroundSize="60px 60px"
            />

            {/* Content */}
            <Box position="relative" zIndex={1}>
              {children}
            </Box>
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </HStack>
    </Box>
  );
};
