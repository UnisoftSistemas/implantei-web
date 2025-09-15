import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useTenantStore } from "@/store/tenantStore";

export const SmartRedirect = () => {
  const { isAuthenticated } = useAuthStore();
  const { isSuperAdmin } = useTenantStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isSuperAdmin) {
    return <Navigate to="/super-admin/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};
