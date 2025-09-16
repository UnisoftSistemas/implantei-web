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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { tenantFormSchema, type TenantFormData } from "@/schemas/tenant";
import type { ITenant } from "@/types";
import { formatCNPJ } from "@/utils/cnpj";

interface TenantFormProps {
  tenant?: ITenant | null;
  onSubmit: (data: TenantFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export const TenantForm = ({
  tenant,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: TenantFormProps) => {
  const { t } = useTranslation();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(tenantFormSchema),
    defaultValues: {
      name: "",
      cnpj: "",
      email: "",
      phone: "",
      segment: "",
      contactPerson: "",
      active: true,
      isTenant: true,
    },
  });

  // Watch values for formatting
  const cnpjValue = watch("cnpj");
  const phoneValue = watch("phone");

  // Set form values when tenant data is available (edit mode)
  useEffect(() => {
    if (tenant && mode === "edit") {
      reset({
        name: tenant.name || "",
        cnpj: tenant.cnpj || "",
        email: tenant.email || "",
        phone: tenant.phone || "",
        segment: tenant.segment || "",
        contactPerson: tenant.contactPerson || "",
        active: tenant.active,
        isTenant: true, // Always true for tenants
      });
    }
  }, [tenant, mode, reset]);

  // Format CNPJ - using backend function
  // Already imported from @/utils/cnpj

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

  // Handle CNPJ formatting
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCNPJ(e.target.value);
    setValue("cnpj", formattedValue, { shouldValidate: true });
  };

  // Handle Phone formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setValue("phone", formattedValue, { shouldValidate: true });
  };

  const onFormSubmit = (data: TenantFormData) => {
    onSubmit(data);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <VStack gap={6} align="stretch">
          {/* Header with mode indicator */}
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {mode === "create"
                ? t("superAdmin.tenants.createTenant")
                : t("superAdmin.tenants.editTenant")}
            </Text>

            {mode === "edit" && tenant && (
              <Badge colorScheme={tenant.active ? "green" : "red"} size="sm">
                {tenant.active ? t("common.active") : t("common.inactive")}
              </Badge>
            )}
          </HStack>

          {/* Basic Information */}
          <Box>
            <Text fontSize="md" fontWeight="medium" color="gray.700" mb={3}>
              {t("superAdmin.tenants.basicInfo")}
            </Text>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {/* Company Name */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Field.Root invalid={!!errors.name}>
                  <Field.Label>{t("companies.name")} *</Field.Label>
                  <Input
                    {...register("name")}
                    placeholder={t("companies.namePlaceholder")}
                    disabled={isLoading}
                  />
                  <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
                </Field.Root>
              </GridItem>

              {/* CNPJ */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Field.Root invalid={!!errors.cnpj}>
                  <Field.Label>CNPJ *</Field.Label>
                  <Input
                    value={cnpjValue}
                    onChange={handleCNPJChange}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    disabled={isLoading}
                  />
                  <Field.ErrorText>{errors.cnpj?.message}</Field.ErrorText>
                </Field.Root>
              </GridItem>

              {/* Segment */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Field.Root>
                  <Field.Label>{t("companies.segment")}</Field.Label>
                  <Input
                    {...register("segment")}
                    placeholder={t("companies.segmentPlaceholder")}
                    disabled={isLoading}
                  />
                </Field.Root>
              </GridItem>

              {/* Contact Person */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Field.Root>
                  <Field.Label>{t("companies.contactPerson")}</Field.Label>
                  <Input
                    {...register("contactPerson")}
                    placeholder={t("companies.contactPersonPlaceholder")}
                    disabled={isLoading}
                  />
                </Field.Root>
              </GridItem>
            </Grid>
          </Box>

          {/* Contact Information */}
          <Box>
            <Text fontSize="md" fontWeight="medium" color="gray.700" mb={3}>
              {t("superAdmin.tenants.contactInfo")}
            </Text>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {/* Email */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Field.Root invalid={!!errors.email}>
                  <Field.Label>{t("companies.email")}</Field.Label>
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="empresa@exemplo.com"
                    disabled={isLoading}
                  />
                  <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                </Field.Root>
              </GridItem>

              {/* Phone */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <Field.Root>
                  <Field.Label>{t("companies.phone")}</Field.Label>
                  <Input
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    disabled={isLoading}
                  />
                </Field.Root>
              </GridItem>
            </Grid>
          </Box>

          {/* Actions */}
          <HStack
            justify="end"
            gap={3}
            pt={4}
            borderTop="1px"
            borderColor="gray.100"
          >
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              {t("common.cancel")}
            </Button>

            <Button
              type="submit"
              colorScheme="blue"
              loading={isLoading}
              loadingText={
                mode === "create"
                  ? t("superAdmin.tenants.creating")
                  : t("superAdmin.tenants.updating")
              }
            >
              {mode === "create"
                ? t("superAdmin.tenants.createTenant")
                : t("common.save")}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

// Export type for backward compatibility
export type { TenantFormData };
