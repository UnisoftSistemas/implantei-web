import { Box, HStack, Text, Link, VStack } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box bg="white" borderTop="1px" borderColor="gray.100" px={8} py={6}>
      <HStack justify="space-between" align="center">
        {/* Left side - branding */}
        <VStack align="start" gap={1}>
          <HStack gap={2} align="center">
            <Box
              w="20px"
              h="20px"
              bg="brand.500"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" color="white" fontWeight="bold">
                📋
              </Text>
            </Box>
            <Text fontSize="sm" fontWeight="bold" color="brand.600">
              implantei
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            © 2025 Implantei. Todos os direitos reservados.
          </Text>
        </VStack>

        {/* Right side - links */}
        <HStack gap={6}>
          <Link
            href="#"
            fontSize="xs"
            color="gray.500"
            fontWeight="medium"
            _hover={{
              color: "brand.500",
              textDecoration: "none",
              transform: "translateY(-1px)",
            }}
            transition="all 0.2s ease-in-out"
          >
            Suporte Técnico
          </Link>
          <Link
            href="#"
            fontSize="xs"
            color="gray.500"
            fontWeight="medium"
            _hover={{
              color: "brand.500",
              textDecoration: "none",
              transform: "translateY(-1px)",
            }}
            transition="all 0.2s ease-in-out"
          >
            Documentação
          </Link>
          <Link
            href="#"
            fontSize="xs"
            color="gray.500"
            fontWeight="medium"
            _hover={{
              color: "brand.500",
              textDecoration: "none",
              transform: "translateY(-1px)",
            }}
            transition="all 0.2s ease-in-out"
          >
            Política de Privacidade
          </Link>

          {/* Status indicator */}
          <HStack gap={2} align="center">
            <Box w="8px" h="8px" bg="green.400" borderRadius="full" />
            <Text fontSize="xs" color="gray.500" fontWeight="medium">
              Todos os sistemas operacionais
            </Text>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  );
};
