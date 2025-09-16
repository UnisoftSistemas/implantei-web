import {
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Button,
  Card,
  Dialog,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Users,
  Activity,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import type { ITenant } from "@/types";

interface TenantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: ITenant | null;
  onEdit?: () => void;
  onManageUsers?: () => void;
}

export const TenantDetailsModal = ({
  isOpen,
  onClose,
  tenant,
  onEdit,
  onManageUsers,
}: TenantDetailsModalProps) => {
  const { t } = useTranslation();

  if (!tenant) return null;

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
      size="xl"
      placement="center"
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="900px" my={8}>
          <Dialog.Header>
            <Dialog.Title>
              <HStack gap={3}>
                <Building2 size={24} color="blue.500" />
                <Text>{tenant.name}</Text>
                <Badge colorScheme={tenant.active ? "green" : "red"} size="sm">
                  {tenant.active ? t("common.active") : t("common.inactive")}
                </Badge>
              </HStack>
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <VStack gap={6} align="stretch">
              {/* Basic Information */}
              <Card.Root>
                <Card.Header pb={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    {t("superAdmin.tenants.basicInfo")}
                  </Text>
                </Card.Header>
                <Card.Body>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                      <VStack align="start" gap={1}>
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          fontWeight="medium"
                        >
                          {t("companies.name")}
                        </Text>
                        <Text fontSize="md" color="gray.800">
                          {tenant.name}
                        </Text>
                      </VStack>
                    </GridItem>

                    <GridItem>
                      <VStack align="start" gap={1}>
                        <Text
                          fontSize="sm"
                          color="gray.500"
                          fontWeight="medium"
                        >
                          CNPJ
                        </Text>
                        <Text fontSize="md" color="gray.800" fontFamily="mono">
                          {tenant.cnpj}
                        </Text>
                      </VStack>
                    </GridItem>

                    {tenant.segment && (
                      <GridItem>
                        <VStack align="start" gap={1}>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            fontWeight="medium"
                          >
                            {t("companies.segment")}
                          </Text>
                          <Text fontSize="md" color="gray.800">
                            {tenant.segment}
                          </Text>
                        </VStack>
                      </GridItem>
                    )}

                    {tenant.contactPerson && (
                      <GridItem>
                        <VStack align="start" gap={1}>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            fontWeight="medium"
                          >
                            {t("companies.contactPerson")}
                          </Text>
                          <Text fontSize="md" color="gray.800">
                            {tenant.contactPerson}
                          </Text>
                        </VStack>
                      </GridItem>
                    )}
                  </Grid>
                </Card.Body>
              </Card.Root>

              {/* Contact Information */}
              {(tenant.email || tenant.phone) && (
                <Card.Root>
                  <Card.Header pb={3}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                      {t("superAdmin.tenants.contactInfo")}
                    </Text>
                  </Card.Header>
                  <Card.Body>
                    <VStack gap={3} align="stretch">
                      {tenant.email && (
                        <HStack gap={3}>
                          <Mail size={16} color="gray.400" />
                          <Text fontSize="md" color="gray.800">
                            {tenant.email}
                          </Text>
                        </HStack>
                      )}

                      {tenant.phone && (
                        <HStack gap={3}>
                          <Phone size={16} color="gray.400" />
                          <Text fontSize="md" color="gray.800">
                            {tenant.phone}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </Card.Body>
                </Card.Root>
              )}

              {/* Statistics */}
              <Card.Root>
                <Card.Header pb={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    {t("superAdmin.tenants.statistics")}
                  </Text>
                </Card.Header>
                <Card.Body>
                  <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    <GridItem>
                      <VStack gap={1}>
                        <HStack gap={2}>
                          <Users size={16} color="blue.500" />
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color="blue.600"
                          >
                            {tenant.userCount || 0}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          {t("superAdmin.tenants.users")}
                        </Text>
                      </VStack>
                    </GridItem>

                    <GridItem>
                      <VStack gap={1}>
                        <HStack gap={2}>
                          <Activity size={16} color="green.500" />
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color="green.600"
                          >
                            {tenant.projectCount || 0}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          {t("superAdmin.tenants.projects")}
                        </Text>
                      </VStack>
                    </GridItem>

                    <GridItem>
                      <VStack gap={1}>
                        <HStack gap={2}>
                          <Calendar size={16} color="purple.500" />
                          <Text
                            fontSize="2xl"
                            fontWeight="bold"
                            color="purple.600"
                          >
                            {Math.floor(
                              (Date.now() -
                                new Date(tenant.createdAt).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          {t("superAdmin.tenants.daysActive")}
                        </Text>
                      </VStack>
                    </GridItem>
                  </Grid>
                </Card.Body>
              </Card.Root>

              {/* Timeline Information */}
              <Card.Root>
                <Card.Header pb={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                    {t("superAdmin.tenants.timeline")}
                  </Text>
                </Card.Header>
                <Card.Body>
                  <VStack gap={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.500">
                        {t("common.createdAt")}:
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="medium">
                        {formatDate(tenant.createdAt)}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.500">
                        {t("common.updatedAt")}:
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontWeight="medium">
                        {formatDate(tenant.updatedAt)}
                      </Text>
                    </HStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer>
            <HStack gap={3}>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{t("common.close")}</Button>
              </Dialog.ActionTrigger>

              {onManageUsers && (
                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={onManageUsers}
                >
                  <Users size={16} /> {t("superAdmin.tenants.manageUsers")}
                </Button>
              )}

              {onEdit && (
                <Button colorScheme="blue" onClick={onEdit}>
                  <Building2 size={16} /> {t("common.edit")}
                </Button>
              )}
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
