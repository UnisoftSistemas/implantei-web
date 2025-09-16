import {
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Textarea,
  createListCollection,
  Field,
  Alert,
  Dialog,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { X, Calendar, DollarSign } from "lucide-react";
import { useCreateProject } from "@/hooks/useProjects";
import { useCompanies } from "@/hooks/useCompanies";
import { useSystems } from "@/hooks/useSystems";
import { useUsers } from "@/hooks/useUsers";
import type { Priority } from "@/types";
import { CustomSelect } from "../Common/CustomSelect";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  companyId: string;
  systemId: string;
  consultantId: string;
  managerId: string;
  priority: Priority;
  startDate: string;
  estimatedEndDate: string;
  budget: string;
  clientAccessEnabled: boolean;
}

export const CreateProjectModal = ({
  isOpen,
  onClose,
}: CreateProjectModalProps) => {
  const { t } = useTranslation();
  const createProjectMutation = useCreateProject();

  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    companyId: "",
    systemId: "",
    consultantId: "",
    managerId: "",
    priority: "medium",
    startDate: "",
    estimatedEndDate: "",
    budget: "",
    clientAccessEnabled: true,
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});

  // Fetch dropdown data
  const { data: companies, isLoading: companiesLoading } = useCompanies({
    active: true,
  });
  const { data: systems, isLoading: systemsLoading } = useSystems({
    active: true,
  });
  const { data: consultants, isLoading: consultantsLoading } = useUsers({
    role: "consultant",
    active: true,
  });
  const { data: managers, isLoading: managersLoading } = useUsers({
    role: "manager",
    active: true,
  });

  // Priority options
  const priorityOptions = createListCollection({
    items: [
      { label: t("task.priority.low"), value: "low" },
      { label: t("task.priority.medium"), value: "medium" },
      { label: t("task.priority.high"), value: "high" },
      { label: t("task.priority.urgent"), value: "urgent" },
    ],
  });

  // Company options
  const companyOptions = createListCollection({
    items:
      companies?.map((company) => ({
        label: company.name,
        value: company.id,
      })) || [],
  });

  // System options
  const systemOptions = createListCollection({
    items:
      systems?.map((system) => ({
        label: system.name,
        value: system.id,
      })) || [],
  });

  // Consultant options
  const consultantOptions = createListCollection({
    items:
      consultants?.map((user) => ({
        label: user.name,
        value: user.id,
      })) || [],
  });

  // Manager options
  const managerOptions = createListCollection({
    items:
      managers?.map((user) => ({
        label: user.name,
        value: user.id,
      })) || [],
  });

  const handleInputChange = (
    field: keyof ProjectFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validation.required");
    }

    if (!formData.companyId) {
      newErrors.companyId = t("validation.required");
    }

    if (!formData.systemId) {
      newErrors.systemId = t("validation.required");
    }

    if (!formData.consultantId) {
      newErrors.consultantId = t("validation.required");
    }

    if (!formData.managerId) {
      newErrors.managerId = t("validation.required");
    }

    if (formData.startDate && formData.estimatedEndDate) {
      if (new Date(formData.estimatedEndDate) <= new Date(formData.startDate)) {
        newErrors.estimatedEndDate = t("validation.endDateAfterStart");
      }
    }

    if (formData.budget && isNaN(Number(formData.budget))) {
      newErrors.budget = t("validation.invalidNumber");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        companyId: formData.companyId,
        systemId: formData.systemId,
        consultantId: formData.consultantId,
        managerId: formData.managerId,
        priority: formData.priority,
        startDate: formData.startDate || undefined,
        estimatedEndDate: formData.estimatedEndDate || undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
        clientAccessEnabled: formData.clientAccessEnabled,
      };

      await createProjectMutation.mutateAsync(projectData);
      handleClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      companyId: "",
      systemId: "",
      consultantId: "",
      managerId: "",
      priority: "medium",
      startDate: "",
      estimatedEndDate: "",
      budget: "",
      clientAccessEnabled: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && handleClose()}
      size="lg"
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          maxW="600px"
          mx={4}
          style={{
            zIndex: 9999,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Dialog.Header>
            <Dialog.Title fontSize="lg" fontWeight="bold">
              {t("project.createNew")}
            </Dialog.Title>
            <Dialog.CloseTrigger
              position="absolute"
              top="4"
              right="4"
              p="2"
              _hover={{ bg: "gray.100" }}
              borderRadius="md"
            >
              <X size={16} />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body p={6} maxH="70vh" overflowY="auto">
            <VStack gap={6} align="stretch">
              {/* Error Alert */}
              {createProjectMutation.error && (
                <Alert.Root status="error">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Description>
                      {t("project.createError")}
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}

              {/* Project Name */}
              <Field.Root invalid={!!errors.name}>
                <Field.Label>{t("project.name")} *</Field.Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("project.namePlaceholder")}
                  bg="white"
                />
                {errors.name && (
                  <Field.ErrorText>{errors.name}</Field.ErrorText>
                )}
              </Field.Root>

              {/* Description */}
              <Field.Root>
                <Field.Label>{t("project.description")}</Field.Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder={t("project.descriptionPlaceholder")}
                  rows={3}
                  bg="white"
                />
              </Field.Root>

              {/* Company and System */}
              <HStack gap={4}>
                <Field.Root flex={1} invalid={!!errors.companyId}>
                  <Field.Label>{t("project.company")} *</Field.Label>
                  <CustomSelect
                    collection={companyOptions}
                    value={formData.companyId}
                    onChange={(value) => handleInputChange("companyId", value)}
                    placeholderKey="project.selectCompany"
                    disabled={companiesLoading}
                  />
                  {errors.companyId && (
                    <Field.ErrorText>{errors.companyId}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root flex={1} invalid={!!errors.systemId}>
                  <Field.Label>{t("project.system")} *</Field.Label>
                  <CustomSelect
                    collection={systemOptions}
                    value={formData.systemId}
                    onChange={(value) => handleInputChange("systemId", value)}
                    placeholderKey="project.selectSystem"
                    disabled={systemsLoading}
                  />
                  {errors.systemId && (
                    <Field.ErrorText>{errors.systemId}</Field.ErrorText>
                  )}
                </Field.Root>
              </HStack>

              {/* Team Assignment */}
              <HStack gap={4}>
                <Field.Root flex={1} invalid={!!errors.consultantId}>
                  <Field.Label>{t("project.consultant")} *</Field.Label>
                  <CustomSelect
                    collection={consultantOptions}
                    value={formData.consultantId}
                    onChange={(value) =>
                      handleInputChange("consultantId", value)
                    }
                    placeholderKey="project.selectConsultant"
                    disabled={consultantsLoading}
                  />
                  {errors.consultantId && (
                    <Field.ErrorText>{errors.consultantId}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root flex={1} invalid={!!errors.managerId}>
                  <Field.Label>{t("project.manager")} *</Field.Label>
                  <CustomSelect
                    collection={managerOptions}
                    value={formData.managerId}
                    onChange={(value) => handleInputChange("managerId", value)}
                    placeholderKey="project.selectManager"
                    disabled={managersLoading}
                  />
                  {errors.managerId && (
                    <Field.ErrorText>{errors.managerId}</Field.ErrorText>
                  )}
                </Field.Root>
              </HStack>

              {/* Priority */}
              <Field.Root>
                <Field.Label>{t("project.priority")}</Field.Label>
                <CustomSelect
                  collection={priorityOptions}
                  value={formData.priority}
                  onChange={(value) => handleInputChange("priority", value)}
                  placeholderKey="project.selectCompany"
                />
              </Field.Root>

              {/* Dates */}
              <HStack gap={4}>
                <Field.Root flex={1}>
                  <Field.Label>
                    <HStack gap={2}>
                      <Calendar size={14} />
                      <Text>{t("project.startDate")}</Text>
                    </HStack>
                  </Field.Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    bg="white"
                  />
                </Field.Root>
                <Field.Root flex={1} invalid={!!errors.estimatedEndDate}>
                  <Field.Label>
                    <HStack gap={2}>
                      <Calendar size={14} />
                      <Text>{t("project.estimatedEndDate")}</Text>
                    </HStack>
                  </Field.Label>
                  <Input
                    type="date"
                    value={formData.estimatedEndDate}
                    onChange={(e) =>
                      handleInputChange("estimatedEndDate", e.target.value)
                    }
                    bg="white"
                  />
                  {errors.estimatedEndDate && (
                    <Field.ErrorText>{errors.estimatedEndDate}</Field.ErrorText>
                  )}
                </Field.Root>
              </HStack>

              {/* Budget */}
              <Field.Root invalid={!!errors.budget}>
                <Field.Label>
                  <HStack gap={2}>
                    <DollarSign size={14} />
                    <Text>{t("project.budget")}</Text>
                  </HStack>
                </Field.Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  placeholder="0.00"
                  bg="white"
                />
                {errors.budget && (
                  <Field.ErrorText>{errors.budget}</Field.ErrorText>
                )}
              </Field.Root>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer p={6} borderTop="1px" borderColor="gray.100">
            <HStack gap={3} w="full" justify="end">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={createProjectMutation.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button
                bg="brand.600"
                color="white"
                _hover={{ bg: "brand.500" }}
                onClick={handleSubmit}
                loading={createProjectMutation.isPending}
                loadingText={t("project.creating")}
              >
                {t("project.create")}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
