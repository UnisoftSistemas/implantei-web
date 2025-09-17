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
  createListCollection,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Edit,
  Mail,
  Phone,
  MoreVertical,
  Eye,
  Trash2,
  Power,
  PowerOff,
  Key,
  Filter,
  Users,
} from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/services/api";
import { UserModal } from "@/components/Modals/UserModal";
import { UserDetailsModal } from "@/components/Modals/UserDetailsModal";
import { CustomSelect } from "@/components/Common/CustomSelect";
import { useTenantStore } from "@/store/tenantStore";
import {
  useToggleUserStatus,
  useDeleteUser,
  useResetUserPassword,
} from "@/hooks/useUserMutations";
import { USER_ROLE_OPTIONS } from "@/schemas/user";
import type {
  User,
  PaginatedResponse,
  ITenant,
  UserRole,
  ApiResponse,
} from "@/types";

export const UsersPage = () => {
  const { t } = useTranslation();
  const { isSuperAdmin, currentTenant } = useTenantStore();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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
  const toggleStatusMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetUserPassword();

  // Fetch available tenants (for super admin filtering)
  const { data: tenantsData } = useQuery({
    queryKey: ["available-tenants"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ITenant[]>>(
        "/companies/tenants"
      );
      return response.data;
    },
    enabled: isSuperAdmin,
    staleTime: 30 * 60 * 1000,
  });

  // Fetch users with filters
  const { data: usersResponse, isLoading } = useQuery({
    queryKey: ["users", page, searchTerm, selectedRole, selectedTenantId],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(searchTerm && { search: searchTerm }),
        ...(selectedRole && { role: selectedRole }),
        ...(isSuperAdmin && selectedTenantId && { tenantId: selectedTenantId }),
      });

      const response = await apiClient.get<PaginatedResponse<User>>(
        `/users?${params.toString()}`
      );
      return response;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Create collections for selects
  const roleCollection = createListCollection({
    items: [
      { label: t("common.all"), value: "" },
      ...USER_ROLE_OPTIONS.map((role) => ({
        label: role.label,
        value: role.value,
      })),
    ],
  });

  const tenantCollection = createListCollection({
    items: [
      { label: t("common.allTenants"), value: "" },
      ...(tenantsData?.map((tenant) => ({
        label: tenant.name,
        value: tenant.id,
      })) || []),
    ],
  });

  // Handle modal actions
  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalState({ create: true, edit: false, details: false });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalState({ create: false, edit: true, details: false });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setModalState({ create: false, edit: false, details: true });
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalState({ create: false, edit: false, details: false });
  };

  // Handle user actions
  const handleToggleStatus = async (user: User) => {
    try {
      await toggleStatusMutation.mutateAsync(user.id);
    } catch (error) {
      console.error("Toggle status error:", error);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (
      window.confirm(t("superAdmin.users.confirmDelete", { name: user.name }))
    ) {
      try {
        await deleteUserMutation.mutateAsync(user.id);
      } catch (error) {
        console.error("Delete user error:", error);
      }
    }
  };

  const handleResetPassword = async (user: User) => {
    const newPassword = prompt(t("superAdmin.users.enterNewPassword"));
    if (newPassword && newPassword.length >= 6) {
      try {
        await resetPasswordMutation.mutateAsync({
          userId: user.id,
          newPassword,
        });
        alert(t("superAdmin.users.passwordResetSuccess"));
      } catch (error) {
        console.error("Reset password error:", error);
      }
    }
  };

  // Get role label
  const getRoleLabel = (role: UserRole) => {
    return USER_ROLE_OPTIONS.find((r) => r.value === role)?.label || role;
  };

  // Get tenant name
  const getTenantName = (tenantId: string | null | undefined) => {
    if (!tenantId) return t("common.noTenant");
    return (
      tenantsData?.find((t) => t.id === tenantId)?.name ||
      t("common.unknownTenant")
    );
  };

  return (
    <Box p={6}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              {t("superAdmin.users.title")}
            </Text>
            <Text color="gray.600" fontSize="sm">
              {isSuperAdmin
                ? t("superAdmin.users.globalDescription")
                : t("superAdmin.users.tenantDescription", {
                    tenant: currentTenant?.name,
                  })}
            </Text>
          </Box>

          <Button colorScheme="brand" onClick={handleCreateUser} size="md">
            <Plus size={16} /> {t("superAdmin.users.createUser")}
          </Button>
        </HStack>

        {/* Filters */}
        <Card.Root>
          <Card.Body>
            <HStack gap={4} wrap="wrap">
              {/* Search */}
              <Box minW="300px" flex={1}>
                <HStack>
                  <Search size={18} color="gray.500" />
                  <Input
                    placeholder={t("superAdmin.users.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="md"
                  />
                </HStack>
              </Box>

              {/* Role Filter */}
              <Box minW="150px">
                <HStack>
                  <Filter size={18} color="gray.500" />
                  <CustomSelect
                    collection={roleCollection}
                    value={selectedRole}
                    onChange={(value) =>
                      setSelectedRole(value as UserRole | "")
                    }
                    placeholder={t("forms.rolePlaceholder")}
                    size="md"
                  />
                </HStack>
              </Box>

              {/* Tenant Filter (Super Admin only) */}
              {isSuperAdmin && (
                <Box minW="200px">
                  <CustomSelect
                    collection={tenantCollection}
                    value={selectedTenantId}
                    onChange={(value) => setSelectedTenantId(value)}
                    placeholder={t("forms.tenantPlaceholder")}
                    size="md"
                  />
                </Box>
              )}
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Users Grid */}
        {isLoading ? (
          <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
            {[...Array(6)].map((_, i) => (
              <GridItem key={i}>
                <Skeleton height="200px" borderRadius="md" />
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Grid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" gap={6}>
            {usersResponse?.data?.map((user) => (
              <GridItem key={user.id}>
                <Card.Root
                  variant="outline"
                  _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                >
                  <Card.Body>
                    <VStack align="stretch" gap={4}>
                      {/* Header with status */}
                      <HStack justify="space-between" align="start">
                        <VStack align="start" gap={1} flex={1}>
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color="gray.800"
                          >
                            {user.name}
                          </Text>
                          <Badge
                            colorScheme={user.active ? "green" : "red"}
                            size="sm"
                          >
                            {user.active
                              ? t("common.active")
                              : t("common.inactive")}
                          </Badge>
                        </VStack>

                        {/* Actions Menu */}
                        <Menu.Root>
                          <Menu.Trigger asChild>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              color="gray.500"
                              _hover={{ color: "gray.700", bg: "gray.100" }}
                            >
                              <MoreVertical size={16} />
                            </IconButton>
                          </Menu.Trigger>

                          <Portal>
                            <Menu.Positioner>
                              <Menu.Content>
                                <Menu.Item
                                  value="view"
                                  onClick={() => handleViewUser(user)}
                                >
                                  <Eye size={16} />
                                  {t("common.view")}
                                </Menu.Item>

                                <Menu.Item
                                  value="edit"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <Edit size={16} />
                                  {t("common.edit")}
                                </Menu.Item>

                                <Menu.Item
                                  value="resetPassword"
                                  onClick={() => handleResetPassword(user)}
                                >
                                  <Key size={16} />
                                  {t("superAdmin.users.resetPassword")}
                                </Menu.Item>

                                <Menu.Item
                                  value="toggleStatus"
                                  onClick={() => handleToggleStatus(user)}
                                >
                                  {user.active ? (
                                    <PowerOff size={16} />
                                  ) : (
                                    <Power size={16} />
                                  )}
                                  {user.active
                                    ? t("superAdmin.users.deactivate")
                                    : t("superAdmin.users.activate")}
                                </Menu.Item>

                                <Menu.Separator />

                                <Menu.Item
                                  value="delete"
                                  color="red.500"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 size={16} />
                                  {t("common.delete")}
                                </Menu.Item>
                              </Menu.Content>
                            </Menu.Positioner>
                          </Portal>
                        </Menu.Root>
                      </HStack>

                      {/* User Info */}
                      <VStack align="stretch" gap={2}>
                        <HStack gap={2}>
                          <Mail size={16} color="gray.500" />
                          <Text fontSize="sm" color="gray.600">
                            {user.email}
                          </Text>
                        </HStack>

                        {user.phone && (
                          <HStack gap={2}>
                            <Phone size={16} color="gray.500" />
                            <Text fontSize="sm" color="gray.600">
                              {user.phone}
                            </Text>
                          </HStack>
                        )}

                        {/* Role */}
                        <HStack gap={2}>
                          <Badge colorScheme="blue" size="sm">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </HStack>

                        {/* Tenant (Super Admin view) */}
                        {isSuperAdmin && (
                          <HStack gap={2}>
                            <Text fontSize="sm" color="gray.500">
                              {t("forms.tenant")}:
                            </Text>
                            <Text
                              fontSize="sm"
                              color="gray.700"
                              fontWeight="medium"
                            >
                              {getTenantName(user.tenantCompanyId)}
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </GridItem>
            ))}
          </Grid>
        )}

        {/* Empty State */}
        {!isLoading &&
          (!usersResponse?.data || usersResponse.data.length === 0) && (
            <Card.Root>
              <Card.Body py={12}>
                <VStack gap={4}>
                  <Box p={4} borderRadius="full" bg="gray.100">
                    <Users size={24} color="gray.500" />
                  </Box>

                  <VStack gap={2}>
                    <Text fontWeight="bold" color="gray.800">
                      {t("superAdmin.users.noUsersFound")}
                    </Text>
                    <Text color="gray.600" textAlign="center" fontSize="sm">
                      {searchTerm || selectedRole || selectedTenantId
                        ? t("superAdmin.users.noUsersMatchFilter")
                        : t("superAdmin.users.noUsersYet")}
                    </Text>
                  </VStack>

                  {!searchTerm && !selectedRole && !selectedTenantId && (
                    <Button
                      colorScheme="brand"
                      onClick={handleCreateUser}
                      size="md"
                      mt={2}
                    >
                      <Plus size={16} /> {t("superAdmin.users.createFirstUser")}
                    </Button>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>
          )}

        {/* Pagination */}
        {usersResponse &&
          usersResponse.pagination &&
          usersResponse.pagination.totalPages > 1 && (
            <HStack justify="center" gap={2}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                {t("common.previous")}
              </Button>

              <Text fontSize="sm" color="gray.600">
                {t("common.pageOf", {
                  current: page,
                  total: usersResponse.pagination.totalPages,
                })}
              </Text>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= usersResponse.pagination.totalPages}
              >
                {t("common.next")}
              </Button>
            </HStack>
          )}
      </VStack>

      {/* Modals */}
      <UserModal
        isOpen={modalState.create}
        onClose={handleCloseModal}
        mode="create"
      />

      <UserModal
        isOpen={modalState.edit}
        onClose={handleCloseModal}
        user={selectedUser}
        mode="edit"
      />

      <UserDetailsModal
        isOpen={modalState.details}
        onClose={handleCloseModal}
        user={selectedUser}
        onEdit={() => {
          setModalState({ create: false, edit: true, details: false });
        }}
      />
    </Box>
  );
};
