import { useEffect } from "react";
import {
  VStack,
  HStack,
  Button,
  Input,
  Text,
  Grid,
  GridItem,
  Box,
  Badge,
  Field,
  createListCollection,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  createUserFormSchema,
  updateUserFormSchema,
  USER_ROLE_OPTIONS,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "@/schemas/user";
import { CustomSelect } from "@/components/Common/CustomSelect";
import { useTenantStore } from "@/store/tenantStore";
import { apiClient } from "@/services/api";
import type { User, ITenant, ApiResponse } from "@/types";

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export const UserForm = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: UserFormProps) => {
  const { t } = useTranslation();
  const { isSuperAdmin } = useTenantStore();

  // Use different schemas for create/edit
  const schema =
    mode === "create" ? createUserFormSchema : updateUserFormSchema;

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "client" as const,
      tenantCompanyId: "",
      active: true,
      ...(mode === "create" && { password: "" }),
    },
  });

  // Watch values for formatting
  const phoneValue = watch("phone");
  const selectedRole = watch("role");
  const selectedTenantId = watch("tenantCompanyId");

  // Fetch available tenants (only for super admin)
  const { data: tenantsData } = useQuery({
    queryKey: ["available-tenants"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ITenant[]>>(
        "/companies/tenants"
      );
      return response.data;
    },
    enabled: isSuperAdmin,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Create tenant collection for select
  const tenantCollection = createListCollection({
    items:
      tenantsData?.map((tenant) => ({
        label: tenant.name,
        value: tenant.id,
      })) || [],
  });

  // Create role collection for select
  const roleCollection = createListCollection({
    items: USER_ROLE_OPTIONS.map((role) => ({
      label: role.label,
      value: role.value,
    })),
  });

  // Set form values when user data is available (edit mode)
  useEffect(() => {
    if (user && mode === "edit") {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: USER_ROLE_OPTIONS.some((option) => option.value === user.role)
          ? (user.role as (typeof USER_ROLE_OPTIONS)[number]["value"])
          : "client",
        tenantCompanyId: user.tenantCompanyId || "",
        active: user.active,
        // Don't set password in edit mode
      });
    }
  }, [user, mode, reset]);

  // Format Phone
  const formatPhone = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length <= 11) {
      if (cleanValue.length <= 10) {
        return cleanValue.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
      } else {
        return cleanValue.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
      }
    }

    return cleanValue.substring(0, 11);
  };

  // Handle Phone formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setValue("phone", formattedValue, { shouldValidate: true });
  };

  const onFormSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    onSubmit(data);
  };

  // Get selected tenant name for display
  const selectedTenantName = tenantsData?.find(
    (t) => t.id === selectedTenantId
  )?.name;

  return (
    <Box>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <VStack gap={6} align="stretch">
          {/* Header with mode indicator */}
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {mode === "create"
                ? t("superAdmin.users.createUser")
                : t("superAdmin.users.editUser")}
            </Text>

            {mode === "edit" && user && (
              <Badge colorScheme={user.active ? "green" : "red"} size="sm">
                {user.active ? t("common.active") : t("common.inactive")}
              </Badge>
            )}
          </HStack>

          {/* Form Fields */}
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Name Field */}
            <GridItem colSpan={1}>
              <Field.Root invalid={!!errors.name}>
                <Field.Label htmlFor="name">{t("forms.name")} *</Field.Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder={t("forms.namePlaceholder")}
                  bg="white"
                  size="md"
                />
                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>

            {/* Email Field */}
            <GridItem colSpan={1}>
              <Field.Root invalid={!!errors.email}>
                <Field.Label htmlFor="email">{t("forms.email")} *</Field.Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder={t("forms.emailPlaceholder")}
                  bg="white"
                  size="md"
                />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>

            {/* Phone Field */}
            <GridItem colSpan={1}>
              <Field.Root invalid={!!errors.phone}>
                <Field.Label htmlFor="phone">{t("forms.phone")}</Field.Label>
                <Input
                  id="phone"
                  value={phoneValue || ""}
                  onChange={handlePhoneChange}
                  placeholder={t("forms.phonePlaceholder")}
                  bg="white"
                  size="md"
                />
                <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>

            {/* Role Field */}
            <GridItem colSpan={1}>
              <Field.Root invalid={!!errors.role}>
                <Field.Label>{t("forms.role")} *</Field.Label>
                <CustomSelect
                  collection={roleCollection}
                  value={selectedRole}
                  onChange={(value) =>
                    setValue(
                      "role",
                      value as (typeof USER_ROLE_OPTIONS)[number]["value"],
                      { shouldValidate: true }
                    )
                  }
                  placeholder={t("forms.rolePlaceholder")}
                  bg="white"
                  size="md"
                />
                <Field.ErrorText>{errors.role?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>

            {/* Tenant Selection (Super Admin only) */}
            {isSuperAdmin && (
              <GridItem colSpan={2}>
                <Field.Root invalid={!!errors.tenantCompanyId}>
                  <Field.Label>{t("forms.tenant")} *</Field.Label>
                  <CustomSelect
                    collection={tenantCollection}
                    value={selectedTenantId || ""}
                    onChange={(value) =>
                      setValue("tenantCompanyId", value, {
                        shouldValidate: true,
                      })
                    }
                    placeholder={t("forms.tenantPlaceholder")}
                    bg="white"
                    size="md"
                  />
                  {selectedTenantName && (
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      {t("forms.selectedTenant")}: {selectedTenantName}
                    </Text>
                  )}
                  <Field.ErrorText>
                    {errors.tenantCompanyId?.message}
                  </Field.ErrorText>
                </Field.Root>
              </GridItem>
            )}

            {/* Password Field (only for create mode) */}
            {mode === "create" && (
              <GridItem colSpan={2}>
                <Field.Root invalid={!!errors.password}>
                  <Field.Label htmlFor="password">
                    {t("forms.password")} *
                  </Field.Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    placeholder={t("forms.passwordPlaceholder")}
                    bg="white"
                    size="md"
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {t("forms.passwordHint")}
                  </Text>
                  <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                </Field.Root>
              </GridItem>
            )}
          </Grid>

          {/* Action Buttons */}
          <HStack justify="flex-end" gap={3} pt={4}>
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              size="md"
            >
              {t("common.cancel")}
            </Button>

            <Button
              type="submit"
              colorScheme="brand"
              loading={isLoading}
              loadingText={
                mode === "create" ? t("common.creating") : t("common.saving")
              }
              size="md"
            >
              {mode === "create" ? t("common.create") : t("common.save")}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};
