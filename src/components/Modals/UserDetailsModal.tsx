import {
  Dialog,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Button,
  Separator,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import { apiClient } from "@/services/api";
import { useTenantStore } from "@/store/tenantStore";
import { USER_ROLE_OPTIONS } from "@/schemas/user";
import type { User as UserType, ITenant, ApiResponse } from "@/types";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onEdit?: () => void;
}

export const UserDetailsModal = ({
  isOpen,
  onClose,
  user,
  onEdit,
}: UserDetailsModalProps) => {
  const { t } = useTranslation();
  const { isSuperAdmin } = useTenantStore();

  // Fetch tenant details if user has one
  const { data: tenantData } = useQuery({
    queryKey: ["tenant", user?.tenantCompanyId],
    queryFn: async () => {
      if (!user?.tenantCompanyId) return null;

      const response = await apiClient.get<ApiResponse<ITenant>>(
        `/companies/${user.tenantCompanyId}`
      );
      return response.data;
    },
    enabled: !!user?.tenantCompanyId && isOpen,
    staleTime: 5 * 60 * 1000,
  });

  // Get role label
  const getRoleLabel = (role: string) => {
    return USER_ROLE_OPTIONS.find((r) => r.value === role)?.label || role;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm");
    } catch {
      return dateString;
    }
  };

  if (!user) return null;

  return (
    <Dialog.Root
      size="md"
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          maxW="500px"
          bg="white"
          borderRadius="xl"
          shadow="xl"
          border="1px solid"
          borderColor="gray.200"
        >
          <Dialog.Header
            bg="gray.50"
            borderTopRadius="xl"
            borderBottom="1px solid"
            borderColor="gray.200"
            px={6}
            py={4}
          >
            <HStack justify="space-between" align="center">
              <Dialog.Title fontSize="lg" fontWeight="bold" color="gray.800">
                {t("superAdmin.users.userDetails")}
              </Dialog.Title>

              <Badge colorScheme={user.active ? "green" : "red"} size="sm">
                {user.active ? t("common.active") : t("common.inactive")}
              </Badge>
            </HStack>
          </Dialog.Header>

          <Dialog.Body p={6}>
            <VStack gap={6} align="stretch">
              {/* User Avatar & Name */}
              <Box textAlign="center">
                <Box
                  mx="auto"
                  w={16}
                  h={16}
                  bg="brand.500"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={3}
                >
                  <User size={32} color="white" />
                </Box>

                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                  {user.name}
                </Text>

                <Badge colorScheme="blue" size="md" mt={2}>
                  {getRoleLabel(user.role)}
                </Badge>
              </Box>

              <Separator />

              {/* Contact Information */}
              <VStack gap={4} align="stretch">
                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                  {t("superAdmin.users.contactInfo")}
                </Text>

                <VStack gap={3} align="stretch" pl={4}>
                  <HStack gap={3}>
                    <Mail size={18} color="gray.500" />
                    <VStack gap={0} align="start">
                      <Text fontSize="sm" color="gray.500">
                        {t("forms.email")}
                      </Text>
                      <Text fontSize="md" color="gray.800">
                        {user.email}
                      </Text>
                    </VStack>
                  </HStack>

                  {user.phone && (
                    <HStack gap={3}>
                      <Phone size={18} color="gray.500" />
                      <VStack gap={0} align="start">
                        <Text fontSize="sm" color="gray.500">
                          {t("forms.phone")}
                        </Text>
                        <Text fontSize="md" color="gray.800">
                          {user.phone}
                        </Text>
                      </VStack>
                    </HStack>
                  )}
                </VStack>
              </VStack>

              <Separator />

              {/* System Information */}
              <VStack gap={4} align="stretch">
                <Text fontSize="md" fontWeight="semibold" color="gray.700">
                  {t("superAdmin.users.systemInfo")}
                </Text>

                <VStack gap={3} align="stretch" pl={4}>
                  <HStack gap={3}>
                    <Shield size={18} color="gray.500" />
                    <VStack gap={0} align="start">
                      <Text fontSize="sm" color="gray.500">
                        {t("forms.role")}
                      </Text>
                      <Text fontSize="md" color="gray.800">
                        {getRoleLabel(user.role)}
                      </Text>
                    </VStack>
                  </HStack>

                  {(isSuperAdmin || tenantData) && (
                    <HStack gap={3}>
                      <Building2 size={18} color="gray.500" />
                      <VStack gap={0} align="start">
                        <Text fontSize="sm" color="gray.500">
                          {t("forms.tenant")}
                        </Text>
                        <Text fontSize="md" color="gray.800">
                          {tenantData?.name ||
                            user.tenantCompanyId ||
                            t("common.noTenant")}
                        </Text>
                      </VStack>
                    </HStack>
                  )}

                  <HStack gap={3}>
                    <Calendar size={18} color="gray.500" />
                    <VStack gap={0} align="start">
                      <Text fontSize="sm" color="gray.500">
                        {t("common.createdAt")}
                      </Text>
                      <Text fontSize="md" color="gray.800">
                        {formatDate(user.createdAt)}
                      </Text>
                    </VStack>
                  </HStack>

                  {user.updatedAt !== user.createdAt && (
                    <HStack gap={3}>
                      <Calendar size={18} color="gray.500" />
                      <VStack gap={0} align="start">
                        <Text fontSize="sm" color="gray.500">
                          {t("common.updatedAt")}
                        </Text>
                        <Text fontSize="md" color="gray.800">
                          {formatDate(user.updatedAt)}
                        </Text>
                      </VStack>
                    </HStack>
                  )}
                </VStack>
              </VStack>

              {/* Tenant Details (if available) */}
              {tenantData && (
                <>
                  <Separator />

                  <VStack gap={4} align="stretch">
                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                      {t("superAdmin.users.tenantDetails")}
                    </Text>

                    <VStack gap={3} align="stretch" pl={4}>
                      <VStack gap={1} align="start">
                        <Text fontSize="sm" color="gray.500">
                          {t("forms.companyName")}
                        </Text>
                        <Text fontSize="md" color="gray.800">
                          {tenantData.name}
                        </Text>
                      </VStack>

                      {tenantData.cnpj && (
                        <VStack gap={1} align="start">
                          <Text fontSize="sm" color="gray.500">
                            CNPJ
                          </Text>
                          <Text fontSize="md" color="gray.800">
                            {tenantData.cnpj}
                          </Text>
                        </VStack>
                      )}

                      {tenantData.segment && (
                        <VStack gap={1} align="start">
                          <Text fontSize="sm" color="gray.500">
                            {t("forms.segment")}
                          </Text>
                          <Text fontSize="md" color="gray.800">
                            {tenantData.segment}
                          </Text>
                        </VStack>
                      )}
                    </VStack>
                  </VStack>
                </>
              )}
            </VStack>
          </Dialog.Body>

          <Dialog.Footer
            px={6}
            py={4}
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <HStack gap={3}>
              <Button variant="outline" onClick={onClose} flex={1}>
                {t("common.close")}
              </Button>

              {onEdit && (
                <Button colorScheme="brand" onClick={onEdit} flex={1}>
                  <Edit size={16} /> {t("common.edit")}
                </Button>
              )}
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
