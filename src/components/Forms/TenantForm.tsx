import { useState } from "react";
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
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import type { ITenant } from "@/types";

interface TenantFormProps {
  tenant?: ITenant | null;
  onSubmit: (data: TenantFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export interface TenantFormData {
  name: string;
  cnpj: string;
  email?: string;
  phone?: string;
  segment?: string;
  contactPerson?: string;
  address?: string;
  active: boolean;
  isTenant: boolean;
}

export const TenantForm = ({
  tenant,
  onSubmit,
  onCancel,
  isLoading = false,
  mode,
}: TenantFormProps) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState<TenantFormData>({
    name: tenant?.name || "",
    cnpj: tenant?.cnpj || "",
    email: tenant?.email || "",
    phone: tenant?.phone || "",
    segment: tenant?.segment || "",
    contactPerson: tenant?.contactPerson || "",
    address: "", // Not in ITenant interface, but common field
    active: tenant?.active ?? true,
    isTenant: tenant?.isTenant ?? true, // Always true for tenant creation
  });

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = t("validation.required");
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = t("validation.required");
    } else if (!isValidCNPJ(formData.cnpj)) {
      newErrors.cnpj = t("validation.invalidCNPJ");
    }

    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = t("validation.invalidEmail");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper functions
  const isValidCNPJ = (cnpj: string): boolean => {
    // Remove non-numeric characters
    const cleanCNPJ = cnpj.replace(/\D/g, "");
    return cleanCNPJ.length === 14;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatCNPJ = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length <= 14) {
      return cleanValue.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );
    }

    return cleanValue;
  };

  const formatPhone = (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length <= 11) {
      return cleanValue.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");
    }

    return cleanValue;
  };

  const handleInputChange = (
    field: keyof TenantFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack gap={6} align="stretch">
          {/* Header with mode indicator */}
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {mode === "create"
                ? t("tenants.createTenant")
                : t("tenants.editTenant")}
            </Text>

            {mode === "edit" && (
              <Badge colorScheme={formData.active ? "green" : "red"} size="sm">
                {formData.active ? t("common.active") : t("common.inactive")}
              </Badge>
            )}
          </HStack>

          {/* Basic Information */}
          <Box>
            <Text fontSize="md" fontWeight="medium" color="gray.700" mb={3}>
              {t("tenants.basicInfo")}
            </Text>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {/* Company Name */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    {t("companies.name")} *
                  </Text>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={t("companies.namePlaceholder")}
                    borderColor={errors.name ? "red.300" : "gray.300"}
                    _focus={{
                      borderColor: errors.name ? "red.500" : "brand.500",
                      boxShadow: `0 0 0 1px ${
                        errors.name ? "red.500" : "brand.500"
                      }`,
                    }}
                  />
                  {errors.name && (
                    <Text fontSize="xs" color="red.500">
                      {errors.name}
                    </Text>
                  )}
                </VStack>
              </GridItem>

              {/* CNPJ */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    CNPJ *
                  </Text>
                  <Input
                    value={formData.cnpj}
                    onChange={(e) =>
                      handleInputChange("cnpj", formatCNPJ(e.target.value))
                    }
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    borderColor={errors.cnpj ? "red.300" : "gray.300"}
                    _focus={{
                      borderColor: errors.cnpj ? "red.500" : "brand.500",
                      boxShadow: `0 0 0 1px ${
                        errors.cnpj ? "red.500" : "brand.500"
                      }`,
                    }}
                  />
                  {errors.cnpj && (
                    <Text fontSize="xs" color="red.500">
                      {errors.cnpj}
                    </Text>
                  )}
                </VStack>
              </GridItem>

              {/* Segment */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    {t("companies.segment")}
                  </Text>
                  <Input
                    value={formData.segment}
                    onChange={(e) =>
                      handleInputChange("segment", e.target.value)
                    }
                    placeholder={t("companies.segmentPlaceholder")}
                  />
                </VStack>
              </GridItem>

              {/* Contact Person */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    {t("companies.contactPerson")}
                  </Text>
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) =>
                      handleInputChange("contactPerson", e.target.value)
                    }
                    placeholder={t("companies.contactPersonPlaceholder")}
                  />
                </VStack>
              </GridItem>
            </Grid>
          </Box>

          {/* Contact Information */}
          <Box>
            <Text fontSize="md" fontWeight="medium" color="gray.700" mb={3}>
              {t("tenants.contactInfo")}
            </Text>

            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {/* Email */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    {t("companies.email")}
                  </Text>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="empresa@exemplo.com"
                    borderColor={errors.email ? "red.300" : "gray.300"}
                    _focus={{
                      borderColor: errors.email ? "red.500" : "brand.500",
                      boxShadow: `0 0 0 1px ${
                        errors.email ? "red.500" : "brand.500"
                      }`,
                    }}
                  />
                  {errors.email && (
                    <Text fontSize="xs" color="red.500">
                      {errors.email}
                    </Text>
                  )}
                </VStack>
              </GridItem>

              {/* Phone */}
              <GridItem colSpan={{ base: 2, md: 1 }}>
                <VStack align="stretch" gap={1}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    {t("companies.phone")}
                  </Text>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange("phone", formatPhone(e.target.value))
                    }
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                </VStack>
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
                  ? t("tenants.creating")
                  : t("tenants.updating")
              }
            >
              {mode === "create" ? t("tenants.createTenant") : t("common.save")}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};
