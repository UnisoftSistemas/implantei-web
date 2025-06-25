import { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Alert,
  Checkbox,
  Link,
  Heading,
} from "@chakra-ui/react";
import { useLogin } from "../hooks/useAuth";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      p={8}
      bg="white"
      borderRadius="xl"
      boxShadow="lg"
    >
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" color="brand.600" mb={2}>
            implantei
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Faça login para continuar
          </Text>
        </Box>

        {loginMutation.error && (
          <Alert.Root status="error" borderRadius="md">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                <Text fontSize="sm">
                  Erro ao fazer login. Verifique suas credenciais.
                </Text>
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <form onSubmit={handleSubmit}>
          <VStack gap={4}>
            <Box w="full">
              <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.700">
                E-mail
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                size="lg"
                borderRadius="md"
                borderColor="gray.300"
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
                required
              />
            </Box>

            <Box w="full">
              <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.700">
                Senha
              </Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                size="lg"
                borderRadius="md"
                borderColor="gray.300"
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
                required
              />
            </Box>

            <Box w="full">
              <Checkbox.Root
                checked={rememberMe}
                onCheckedChange={(e) => setRememberMe(!!e.checked)}
                colorPalette="brand"
                size="sm"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>
                  <Text fontSize="sm" color="gray.600">
                    Mantenha-me conectado por 30 dias
                  </Text>
                </Checkbox.Label>
              </Checkbox.Root>
            </Box>

            <Button
              type="submit"
              size="lg"
              w="full"
              bg="gray.800"
              color="white"
              borderRadius="md"
              _hover={{ bg: "gray.700" }}
              _active={{ bg: "gray.900" }}
              loading={loginMutation.isPending}
              loadingText="Entrando..."
            >
              Entrar
            </Button>
          </VStack>
        </form>

        <Box textAlign="center" pt={4} borderTop="1px" borderColor="gray.200">
          <Text fontSize="sm" color="gray.600">
            Você está conectado na conta:{" "}
            <Text as="span" fontWeight="medium" color="gray.800">
              Sistema XYZ LTDA
            </Text>
          </Text>

          <Box mt={4} fontSize="xs" color="gray.500">
            <Link href="#" mr={4}>
              Política de privacidade
            </Link>
            <Text as="span">2025 - Todos os direitos reservados</Text>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};
