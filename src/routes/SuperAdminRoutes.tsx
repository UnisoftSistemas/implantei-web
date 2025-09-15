import { Routes, Route } from "react-router-dom";
import { SuperAdminLayout } from "@/components/Layout/SuperAdminLayout";
import { TenantGuard } from "@/components/Auth/TenantGuard";
import { SuperAdminDashboard, TenantsPage } from "@/pages/SuperAdmin";

export const SuperAdminRoutes = () => (
  <TenantGuard requiredPermission="manage_tenants">
    <SuperAdminLayout>
      <Routes>
        <Route path="/" element={<SuperAdminDashboard />} />
        <Route path="/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/tenants" element={<TenantsPage />} />
        {/* Future routes */}
        <Route
          path="/users"
          element={<div>Super Admin Users Page (Coming Soon)</div>}
        />
        <Route
          path="/reports"
          element={<div>Super Admin Reports Page (Coming Soon)</div>}
        />
      </Routes>
    </SuperAdminLayout>
  </TenantGuard>
);
