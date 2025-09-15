import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  Users,
  UserCheck,
  Ticket,
  Folder,
  CheckSquare,
  Calendar,
  FileText,
  Settings,
  Menu,
  ChevronLeft,
  Lightbulb,
  Building2,
} from "lucide-react";
import { useState } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarItemProps {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  label: string;
  path: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
}

const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  isCollapsed,
  onClick,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      justifyContent={isCollapsed ? "center" : "flex-start"}
      w="full"
      h="auto"
      p={isCollapsed ? 3 : 4}
      bg={isActive ? "brand.600" : "transparent"}
      color="white"
      borderRadius="lg"
      fontWeight={isActive ? "semibold" : "medium"}
      opacity={isActive ? 1 : 0.8}
      transition="all 0.2s ease-in-out"
      _hover={{
        bg: isActive ? "brand.500" : "rgba(255,255,255,0.1)",
        opacity: 1,
      }}
      _active={{
        bg: isActive ? "brand.700" : "rgba(255,255,255,0.15)",
      }}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
    >
      {isCollapsed ? (
        <Icon size={20} />
      ) : (
        <HStack gap={3} w="full">
          <Icon size={20} />
          <Text fontSize="sm" letterSpacing="0.01em">
            {label}
          </Text>
        </HStack>
      )}
    </Button>
  );
};

export const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { canManageTenants } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: t("nav.dashboard"), path: "/dashboard" },
    { icon: Users, label: t("nav.cadastros"), path: "/cadastros" },
    { icon: UserCheck, label: t("nav.crm"), path: "/crm" },
    { icon: Ticket, label: t("nav.tickets"), path: "/tickets" },
    { icon: Folder, label: t("nav.projects"), path: "/projects" },
    { icon: CheckSquare, label: t("nav.tarefas"), path: "/tarefas" },
    { icon: Calendar, label: t("nav.calendario"), path: "/calendario" },
    { icon: FileText, label: t("nav.relatorios"), path: "/relatorios" },
    { icon: Settings, label: t("nav.configuracoes"), path: "/configuracoes" },
  ];

  const SAItems = [
    {
      icon: BarChart3,
      label: t("nav.sa.dashboard"),
      path: "/super-admin/dashboard",
    },
    {
      icon: Building2,
      label: t("nav.sa.manageTenants"),
      path: "/super-admin/tenants",
    },
    { icon: Users, label: t("nav.sa.manageUsers"), path: "/super-admin/users" },
    {
      icon: Settings,
      label: t("nav.sa.settings"),
      path: "/super-admin/settings",
    },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      w={isCollapsed ? "80px" : "280px"}
      bg="brand.700"
      overflowY="auto"
      position="relative"
      transition="width 0.3s ease-in-out"
    >
      {/* Header */}
      <Box
        px={isCollapsed ? 3 : 6}
        py={6}
        mb={4}
        bg="brand.800"
        position="relative"
        overflow="hidden"
      >
        <HStack justify="space-between" align="center">
          {!isCollapsed && (
            <Image
              src="/images/logo.svg"
              alt="Implantei"
              h="70px"
              w="auto"
              objectFit="contain"
            />
          )}

          <IconButton
            variant="ghost"
            size="md"
            color="white"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
            onClick={toggleCollapse}
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </IconButton>
        </HStack>
      </Box>

      {/* Navigation */}
      {canManageTenants ? (
        <Box px={6} py={2}>
          <VStack gap={1} align="stretch">
            {/* Super Admin Dashboard */}
            {SAItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
                isCollapsed={isCollapsed}
                onClick={() => navigate(item.path)}
              />
            ))}
          </VStack>
        </Box>
      ) : (
        <Box px={isCollapsed ? 2 : 4} pb={6}>
          <VStack gap={1} align="stretch">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={location.pathname === item.path}
                isCollapsed={isCollapsed}
                onClick={() => navigate(item.path)}
              />
            ))}
          </VStack>

          {/* Bottom tip card - only show when expanded */}
          {!isCollapsed && (
            <Box mt={8} mx={2}>
              <Box
                p={4}
                bg="brand.800"
                borderRadius="xl"
                position="relative"
                overflow="hidden"
              >
                <VStack gap={2} align="start" position="relative">
                  <HStack gap={2}>
                    <Lightbulb size={16} color="#FCF553" />
                    <Text fontSize="sm" fontWeight="semibold" color="#FCF553">
                      {t("tips.dailyTip")}
                    </Text>
                  </HStack>
                  <Text
                    fontSize="xs"
                    color="white"
                    lineHeight="1.4"
                    opacity="0.9"
                  >
                    {t("tips.addMilestones")}
                  </Text>
                </VStack>
              </Box>
            </Box>
          )}

          {/* Collapsed tip - just icon */}
          {isCollapsed && (
            <Box mt={8} display="flex" justifyContent="center">
              <Box
                p={3}
                bg="brand.800"
                borderRadius="lg"
                cursor="pointer"
                title={`${t("tips.dailyTip")}: ${t("tips.addMilestones")}`}
              >
                <Lightbulb size={20} color="#FCF553" />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
