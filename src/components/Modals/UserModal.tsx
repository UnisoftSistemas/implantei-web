import { Dialog, Spinner, VStack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { UserForm } from "@/components/Forms/UserForm";
import { useCreateUser, useUpdateUser } from "@/hooks/useUserMutations";
import type { User } from "@/types";
import type { CreateUserFormData, UpdateUserFormData } from "@/schemas/user";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  mode: "create" | "edit";
}

export const UserModal = ({
  isOpen,
  onClose,
  user = null,
  mode,
}: UserModalProps) => {
  const { t } = useTranslation();

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Handle form submission
  const handleSubmit = async (
    data: CreateUserFormData | UpdateUserFormData
  ) => {
    try {
      if (mode === "create") {
        await createUserMutation.mutateAsync(data as CreateUserFormData);
      } else if (mode === "edit" && user) {
        await updateUserMutation.mutateAsync({
          id: user.id,
          userData: data as UpdateUserFormData,
        });
      }

      onClose();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error("User form submission error:", error);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!createUserMutation.isPending && !updateUserMutation.isPending) {
      onClose();
    }
  };

  // Loading state
  const isLoading =
    createUserMutation.isPending || updateUserMutation.isPending;

  return (
    <Dialog.Root
      size="lg"
      open={isOpen}
      onOpenChange={(details) => !details.open && handleClose()}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          maxW="600px"
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
            <Dialog.Title fontSize="lg" fontWeight="bold" color="gray.800">
              {mode === "create"
                ? t("superAdmin.users.createUser")
                : t("superAdmin.users.editUser")}
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body p={6}>
            {isLoading ? (
              <VStack gap={4} py={8}>
                <Spinner size="lg" color="brand.500" />
                <Text color="gray.600">
                  {mode === "create"
                    ? t("superAdmin.users.creatingUser")
                    : t("superAdmin.users.updatingUser")}
                </Text>
              </VStack>
            ) : (
              <UserForm
                user={user}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                isLoading={isLoading}
                mode={mode}
              />
            )}
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
