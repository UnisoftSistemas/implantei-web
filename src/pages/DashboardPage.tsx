import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import { useAuthStore } from "../store/authStore";
import { useLogout } from "../hooks/useAuth";

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "manager":
        return "blue";
      case "consultant":
        return "green";
      case "technician":
        return "orange";
      default:
        return "gray";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "manager":
        return "Gestor";
      case "consultant":
        return "Consultor";
      case "technician":
        return "Técnico";
      default:
        return role;
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Simple header */}
      <Box bg="white" borderBottom="1px" borderColor="gray.200" px={6} py={4}>
        <HStack justify="space-between" align="center">
          <HStack gap={4}>
            <Text fontSize="xl" fontWeight="bold" color="brand.600">
              implantei
            </Text>
            <Badge colorScheme="green" variant="subtle">
              Dashboard
            </Badge>
          </HStack>

          <HStack gap={4}>
            {user && (
              <HStack gap={3}>
                <Avatar.Root size="sm">
                  <Avatar.Image src={user.profileImageUrl} />
                  <Avatar.Fallback>{user.name}</Avatar.Fallback>
                </Avatar.Root>
                <VStack gap={0} align="start">
                  <Text fontSize="sm" fontWeight="medium">
                    {user.name}
                  </Text>
                  <Badge
                    size="xs"
                    colorScheme={getRoleBadgeColor(user.role)}
                    variant="subtle"
                  >
                    {getRoleLabel(user.role)}
                  </Badge>
                </VStack>
              </HStack>
            )}

            <Button
              size="sm"
              variant="outline"
              colorScheme="gray"
              onClick={handleLogout}
              loading={logoutMutation.isPending}
              loadingText="Saindo..."
            >
              Sair
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Main content */}
      <Box p={6}>
        <VStack gap={6} align="stretch">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
              Bem-vindo ao Sistema Implantei! 👋
            </Text>
            <Text color="gray.600">
              Autenticação funcionando perfeitamente. Próximos passos: Layout e
              módulos.
            </Text>
          </Box>

          {user && (
            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor="gray.200"
            >
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Dados do Usuário
              </Text>
              <VStack align="start" gap={2}>
                <HStack>
                  <Text fontWeight="medium" minW="100px">
                    Nome:
                  </Text>
                  <Text>{user.name}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="medium" minW="100px">
                    Email:
                  </Text>
                  <Text>{user.email}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="medium" minW="100px">
                    Perfil:
                  </Text>
                  <Badge
                    colorScheme={getRoleBadgeColor(user.role)}
                    variant="subtle"
                  >
                    {getRoleLabel(user.role)}
                  </Badge>
                </HStack>
                {user.phone && (
                  <HStack>
                    <Text fontWeight="medium" minW="100px">
                      Telefone:
                    </Text>
                    <Text>{user.phone}</Text>
                  </HStack>
                )}
                <HStack>
                  <Text fontWeight="medium" minW="100px">
                    Status:
                  </Text>
                  <Badge
                    colorScheme={user.active ? "green" : "red"}
                    variant="subtle"
                  >
                    {user.active ? "Ativo" : "Inativo"}
                  </Badge>
                </HStack>
              </VStack>
            </Box>
          )}

          <Box
            bg="brand.50"
            p={6}
            borderRadius="lg"
            border="1px"
            borderColor="brand.200"
          >
            <Text fontSize="md" fontWeight="medium" color="brand.800" mb={2}>
              🚀 Próximos Passos
            </Text>
            <Text color="brand.700" fontSize="sm">
              • Layout principal (sidebar, header, footer)
              <br />
              • Dashboard com cards e estatísticas
              <br />
              • Módulos de projetos, empresas e usuários
              <br />• Sistema de navegação completo
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};
