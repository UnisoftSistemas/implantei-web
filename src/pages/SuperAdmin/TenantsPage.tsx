import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Badge,
  Card,
  Grid,
  GridItem,
  IconButton,
  Skeleton,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Users,
  Building2,
  Mail,
  Phone,
  MoreVertical,
  Eye,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/services/api";
import { TenantModal } from "@/components/Modals/TenantModal";
import { TenantDetailsModal } from "@/components/Modals/TenantDetailsModal";
import {
  useToggleTenantStatus,
  useDeleteTenant,
} from "@/hooks/useTenantMutations";
import type { ITenant, PaginatedResponse } from "@/types";

export const TenantsPage = () => {
  const { t } = useTranslation();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<ITenant | null>(null);
  const [modalState, setModalState] = useState<{
    create: boolean;
    edit: boolean;
    details: boolean;
  }>({
    create: false,
    edit: false,
    details: false,
  });

  // Mutations
  const toggleStatusMutation = useToggleTenantStatus();
  const deleteTenantMutation = useDeleteTenant();

  // Fetch tenants with pagination
  const { data: tenantsResponse, isLoading } = useQuery({
    queryKey: ["tenants", page, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(searchTerm && { search: searchTerm }),
        isTenant: "true", // Only fetch tenant companies
      });

      const response = await apiClient.get<PaginatedResponse<ITenant>>(
        `/companies?${params}`
      );
      return response;
    },
  });

  // Modal handlers
  const handleCreateTenant = () => {
    setSelectedTenant(null);
    setModalState({ create: true, edit: false, details: false });
  };

  const handleEditTenant = (tenant: ITenant) => {
    setSelectedTenant(tenant);
    setModalState({ create: false, edit: true, details: false });
  };

  const handleViewDetails = (tenant: ITenant) => {
    setSelectedTenant(tenant);
    setModalState({ create: false, edit: false, details: true });
  };

  const handleCloseModals = () => {
    setModalState({ create: false, edit: false, details: false });
    setSelectedTenant(null);
  };

  // Actions
  const handleToggleStatus = async (tenant: ITenant) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: tenant.id,
        active: !tenant.active,
      });
    } catch (error) {
      console.error("Error toggling tenant status:", error);
    }
  };

  const handleDeleteTenant = async (tenant: ITenant) => {
    if (window.confirm(t("tenants.confirmDelete", { name: tenant.name }))) {
      try {
        await deleteTenantMutation.mutateAsync(tenant.id);
      } catch (error) {
        console.error("Error deleting tenant:", error);
      }
    }
  };

  const handleManageUsers = (tenant: ITenant) => {
    // TODO: Navigate to users management page
    console.log("Manage users for tenant:", tenant.id);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <VStack gap={8} align="stretch">
      {/* Header */}
      <Box>
        <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
          {t("superAdmin.tenants.title")}
        </Text>
        <Text color="gray.600" fontSize="lg">
          {t("superAdmin.tenants.subtitle")}
        </Text>
      </Box>

      {/* Actions Bar */}
      <HStack justify="space-between" align="center">
        {/* Search */}
        <HStack flex={1} maxW="400px" gap={3}>
          <Box position="relative" flex={1}>
            <Input
              placeholder={t("superAdmin.tenants.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              paddingStart="40px"
            />
            <Box
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
            >
              <Search size={16} />
            </Box>
          </Box>
        </HStack>

        {/* Create Tenant Button */}
        <Button colorScheme="blue" size="md" onClick={handleCreateTenant}>
          <Plus size={16} /> {t("superAdmin.tenants.createTenant")}
        </Button>
      </HStack>

      {/* Stats Summary */}
      <HStack gap={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {tenantsResponse?.pagination.total || 0}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {t("superAdmin.tenants.totalTenants")}
          </Text>
        </Box>

        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="green.600">
            {tenantsResponse?.data.filter((t) => t.active).length || 0}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {t("superAdmin.tenants.activeTenants")}
          </Text>
        </Box>
      </HStack>

      {/* Tenants Grid */}
      <Box>
        <Grid templateColumns="repeat(auto-fit, minmax(350px, 1fr))" gap={6}>
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height="240px" borderRadius="xl" />
            ))
          ) : tenantsResponse?.data.length ? (
            tenantsResponse.data.map((tenant) => (
              <Card.Root
                key={tenant.id}
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
              >
                <Card.Body p={6}>
                  <VStack align="stretch" gap={4}>
                    {/* Header */}
                    <HStack justify="space-between" align="start">
                      <VStack align="start" gap={1} flex={1}>
                        <HStack gap={2} align="center">
                          <Building2 size={16} color="blue.500" />
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color="gray.800"
                          >
                            {tenant.name}
                          </Text>
                        </HStack>

                        <Text fontSize="sm" color="gray.500">
                          CNPJ: {tenant.cnpj}
                        </Text>
                      </VStack>

                      <HStack gap={2}>
                        <Badge
                          colorScheme={tenant.active ? "green" : "red"}
                          size="sm"
                        >
                          {tenant.active
                            ? t("common.active")
                            : t("common.inactive")}
                        </Badge>

                        {/* Actions Menu */}
                        <Menu.Root>
                          <Menu.Trigger asChild>
                            <IconButton
                              size="sm"
                              variant="ghost"
                              aria-label={t("common.actions")}
                            >
                              <MoreVertical size={14} />
                            </IconButton>
                          </Menu.Trigger>
                          <Portal>
                            <Menu.Positioner>
                              <Menu.Content>
                                <Menu.Item
                                  value="viewDetails"
                                  onClick={() => handleViewDetails(tenant)}
                                >
                                  <Eye size={14} />
                                  <Text ml={2}>{t("common.viewDetails")}</Text>
                                </Menu.Item>

                                <Menu.Item
                                  value="edit"
                                  onClick={() => handleEditTenant(tenant)}
                                >
                                  <Edit size={14} />
                                  <Text ml={2}>{t("common.edit")}</Text>
                                </Menu.Item>

                                <Menu.Item
                                  value="manageUsers"
                                  onClick={() => handleManageUsers(tenant)}
                                >
                                  <Users size={14} />
                                  <Text ml={2}>{t("tenants.manageUsers")}</Text>
                                </Menu.Item>

                                <Menu.Item
                                  value="activation"
                                  onClick={() => handleToggleStatus(tenant)}
                                >
                                  {tenant.active ? (
                                    <PowerOff size={14} />
                                  ) : (
                                    <Power size={14} />
                                  )}
                                  <Text ml={2}>
                                    {tenant.active
                                      ? t("common.deactivate")
                                      : t("common.activate")}
                                  </Text>
                                </Menu.Item>

                                <Menu.Item
                                  value="delete"
                                  onClick={() => handleDeleteTenant(tenant)}
                                  color="red.600"
                                >
                                  <Trash2 size={14} />
                                  <Text ml={2}>{t("common.delete")}</Text>
                                </Menu.Item>
                              </Menu.Content>
                            </Menu.Positioner>
                          </Portal>
                        </Menu.Root>
                      </HStack>
                    </HStack>

                    {/* Details */}
                    <VStack align="stretch" gap={2}>
                      {tenant.segment && (
                        <HStack gap={2}>
                          <Text fontSize="sm" color="gray.600">
                            {t("companies.segment")}:
                          </Text>
                          <Text
                            fontSize="sm"
                            color="gray.800"
                            fontWeight="medium"
                          >
                            {tenant.segment}
                          </Text>
                        </HStack>
                      )}

                      {tenant.email && (
                        <HStack gap={2}>
                          <Mail size={14} color="gray.400" />
                          <Text fontSize="sm" color="gray.600">
                            {tenant.email}
                          </Text>
                        </HStack>
                      )}

                      {tenant.phone && (
                        <HStack gap={2}>
                          <Phone size={14} color="gray.400" />
                          <Text fontSize="sm" color="gray.600">
                            {tenant.phone}
                          </Text>
                        </HStack>
                      )}

                      {tenant.contactPerson && (
                        <HStack gap={2}>
                          <Users size={14} color="gray.400" />
                          <Text fontSize="sm" color="gray.600">
                            {tenant.contactPerson}
                          </Text>
                        </HStack>
                      )}
                    </VStack>

                    {/* Stats */}
                    <HStack
                      justify="space-between"
                      pt={2}
                      borderTop="1px"
                      borderColor="gray.100"
                    >
                      <VStack gap={0} align="center">
                        <Text fontSize="lg" fontWeight="bold" color="blue.600">
                          {tenant.userCount || 0}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {t("superAdmin.tenants.users")}
                        </Text>
                      </VStack>

                      <VStack gap={0} align="center">
                        <Text fontSize="lg" fontWeight="bold" color="green.600">
                          {tenant.projectCount || 0}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {t("superAdmin.tenants.projects")}
                        </Text>
                      </VStack>

                      <VStack gap={0} align="center">
                        <Text fontSize="xs" color="gray.500">
                          {t("common.since")}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          {formatDate(tenant.createdAt)}
                        </Text>
                      </VStack>
                    </HStack>

                    {/* Quick Actions */}
                    <HStack gap={2} pt={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        flex={1}
                        onClick={() => handleViewDetails(tenant)}
                      >
                        <Eye size={14} /> {t("common.viewDetails")}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="green"
                        flex={1}
                        onClick={() => handleManageUsers(tenant)}
                      >
                        <Users size={14} />{" "}
                        {t("superAdmin.tenants.manageUsers")}
                      </Button>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))
          ) : (
            <GridItem colSpan={{ base: 1, lg: 3 }}>
              <Card.Root
                bg="gray.50"
                borderRadius="xl"
                borderStyle="dashed"
                borderColor="gray.300"
              >
                <Card.Body textAlign="center" py={12}>
                  <VStack gap={4}>
                    <Building2 size={48} color="gray.400" />
                    <VStack gap={1}>
                      <Text fontSize="lg" fontWeight="medium" color="gray.600">
                        {t("superAdmin.tenants.noTenants")}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {t("superAdmin.tenants.createFirstTenant")}
                      </Text>
                    </VStack>

                    <Button
                      colorScheme="blue"
                      size="md"
                      onClick={handleCreateTenant}
                    >
                      <Plus size={16} /> {t("superAdmin.tenants.createTenant")}
                    </Button>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </GridItem>
          )}
        </Grid>
      </Box>

      {/* Pagination */}
      {tenantsResponse && tenantsResponse.pagination.total > 12 && (
        <Box>
          <HStack justify="center" gap={2}>
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              {t("common.previous")}
            </Button>

            <Text fontSize="sm" color="gray.600" px={4}>
              {t("common.pageOf", {
                current: page,
                total: Math.ceil(tenantsResponse.pagination.total / 12),
              })}
            </Text>

            <Button
              size="sm"
              variant="outline"
              disabled={
                page >= Math.ceil(tenantsResponse.pagination.total / 12)
              }
              onClick={() => setPage(page + 1)}
            >
              {t("common.next")}
            </Button>
          </HStack>
        </Box>
      )}

      {/* Modals */}
      <TenantModal
        isOpen={modalState.create}
        onClose={handleCloseModals}
        mode="create"
      />

      <TenantModal
        isOpen={modalState.edit}
        onClose={handleCloseModals}
        tenant={selectedTenant}
        mode="edit"
      />

      <TenantDetailsModal
        isOpen={modalState.details}
        onClose={handleCloseModals}
        tenant={selectedTenant}
        onEdit={() => {
          setModalState({ create: false, edit: true, details: false });
        }}
        onManageUsers={() => handleManageUsers(selectedTenant!)}
      />
    </VStack>
  );
};
