import { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Alert,
  Checkbox,
  HStack,
  Separator,
  Link,
  Image,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/hooks/useAuth";

export const ModernLoginForm = () => {
  const { t } = useTranslation();
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
    <Box>
      <VStack gap={8} align="stretch">
          <HStack align="center" mb={4} left={50} position="relative">
            <Image src="/images/logo03.png" alt="Logo" maxW={350} />
          </HStack>

        {/* Error Alert */}
        {loginMutation.error && (
          <Alert.Root
            status="error"
            borderRadius="lg"
            border="1px solid"
            borderColor="red.200"
            bg="red.50"
          >
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                <Text fontSize="sm" color="red.700">
                  {t("auth.loginError")}
                </Text>
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <VStack gap={6}>
            {/* Email Field */}
            <Box w="full">
              <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.700">
                {t("auth.email")}
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                size="lg"
                borderRadius="lg"
                borderColor="gray.300"
                bg="white"
                _hover={{
                  borderColor: "gray.400",
                }}
                _focus={{
                  borderColor: "#6366f1",
                  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                  outline: "none",
                }}
                _invalid={{
                  borderColor: "red.300",
                  boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
                }}
                required
              />
            </Box>

            {/* Password Field */}
            <Box w="full">
              <Text mb={2} fontSize="sm" fontWeight="medium" color="gray.700">
                {t("auth.password")}
              </Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                size="lg"
                borderRadius="lg"
                borderColor="gray.300"
                bg="white"
                _hover={{
                  borderColor: "gray.400",
                }}
                _focus={{
                  borderColor: "#6366f1",
                  boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.1)",
                  outline: "none",
                }}
                _invalid={{
                  borderColor: "red.300",
                  boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)",
                }}
                required
              />
            </Box>

            {/* Remember Me */}
            <Box w="full">
              <Checkbox.Root
                checked={rememberMe}
                onCheckedChange={(e) => setRememberMe(!!e.checked)}
                colorPalette="purple"
                size="md"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control
                  _checked={{
                    bg: "#6366f1",
                    borderColor: "#6366f1",
                  }}
                >
                  <Checkbox.Indicator color="white" />
                </Checkbox.Control>
                <Checkbox.Label ml={3}>
                  <Text fontSize="sm" color="gray.600">
                    {t("auth.rememberMe")}
                  </Text>
                </Checkbox.Label>
              </Checkbox.Root>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              w="full"
              bg="#201835"
              color="white"
              borderRadius="lg"
              _hover={{
                bg: "linear-gradient(135deg, #5855eb 0%, #7c3aed 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
              }}
              _active={{
                transform: "translateY(0px)",
                boxShadow: "0 5px 15px rgba(99, 102, 241, 0.3)",
              }}
              transition="all 0.2s"
              fontWeight="medium"
              loading={loginMutation.isPending}
              loadingText={t("common.loading")}
            >
              {t("auth.login")}
            </Button>
          </VStack>
        </form>

        {/* Footer */}
        <Box>
          <Separator />

          <VStack gap={4} pt={6}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              {t("auth.connectedAccount")}
            </Text>

            <Box
              bg="gray.50"
              borderRadius="lg"
              p={4}
              textAlign="center"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontSize="sm" fontWeight="medium" color="gray.800">
                {t("auth.systemName")}
              </Text>
            </Box>

            <HStack gap={6} justify="center" pt={2}>
              <Link
                href="#"
                fontSize="xs"
                color="gray.500"
                _hover={{ color: "gray.700" }}
              >
                {t("auth.privacyPolicy")}
              </Link>
              <Text fontSize="xs" color="gray.400">
                •
              </Text>
              <Text fontSize="xs" color="gray.500">
                {new Date().getFullYear()} - {t("auth.allRightsReserved")}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
