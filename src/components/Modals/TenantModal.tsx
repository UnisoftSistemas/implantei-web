import { Box, Dialog, Portal } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { TenantForm, type TenantFormData } from "@/components/Forms/TenantForm";
import { useCreateTenant, useUpdateTenant } from "@/hooks/useTenantMutations";
import type { ITenant } from "@/types";

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: ITenant | null;
  mode: "create" | "edit";
}

export const TenantModal = ({
  isOpen,
  onClose,
  tenant,
  mode,
}: TenantModalProps) => {
  const { t } = useTranslation();
  const createTenantMutation = useCreateTenant();
  const updateTenantMutation = useUpdateTenant();

  const isLoading =
    createTenantMutation.isPending || updateTenantMutation.isPending;

  const handleSubmit = async (data: TenantFormData) => {
    try {
      if (mode === "create") {
        await createTenantMutation.mutateAsync(data);
        console.log("✅ Tenant created successfully");
      } else if (mode === "edit" && tenant) {
        await updateTenantMutation.mutateAsync({
          id: tenant.id,
          data,
        });
        console.log("✅ Tenant updated successfully");
      }

      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("❌ Error submitting tenant form:", error);
      // Keep modal open so user can see the error and try again
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={handleClose}
      size="lg"
      placement="center"
      motionPreset="slide-in-bottom"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="800px" my={8}>
            <Dialog.Header>
              <Dialog.Title>
                {mode === "create"
                  ? t("superAdmin.tenants.createTenant")
                  : t("superAdmin.tenants.editTenant")}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body p={0}>
              <Box p={6}>
                <TenantForm
                  tenant={tenant}
                  onSubmit={handleSubmit}
                  onCancel={handleClose}
                  isLoading={isLoading}
                  mode={mode}
                />
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
