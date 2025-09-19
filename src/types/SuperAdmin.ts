// Super Admin Dashboard specific types

export interface SuperAdminDashboardStats {
  totalTenants: number;
  activeTenants: number;
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
  tenantGrowth: number;
  projectGrowth: number;
}

export interface SuperAdminActivity {
  id: string;
  type: SuperAdminActivityType;
  description: string;
  timestamp: Date;
  tenantName?: string;
  userName?: string;
  metadata?: SuperAdminActivityMetadata;
}

export type SuperAdminActivityType =
  | "tenant_created"
  | "tenant_activated"
  | "tenant_deactivated"
  | "user_registered"
  | "user_role_changed"
  | "project_started"
  | "project_completed"
  | "project_cancelled"
  | "system_maintenance"
  | "backup_completed";

export interface SuperAdminActivityMetadata {
  projectName?: string;
  companyName?: string;
  userRole?: string;
  previousRole?: string;
  newRole?: string;
  projectId?: string;
  tenantId?: string;
  userId?: string;
  maintenanceType?: string;
  backupSize?: string;
}

// Quick metrics interface for lighter API calls
export interface SuperAdminQuickMetrics {
  activeTenantsCount: number;
  totalUsersCount: number;
  activeProjectsCount: number;
  pendingTasksCount: number;
  monthlyRevenueTotal: number;
  growthPercentages: {
    tenants: number;
    users: number;
    projects: number;
    revenue: number;
  };
}

// System health metrics
export interface SuperAdminSystemHealth {
  apiResponseTime: number;
  databaseConnections: number;
  activeUserSessions: number;
  systemUptime: number;
  memoryUsage: number;
  diskUsage: number;
  lastBackup: string;
}

// Revenue analytics
export interface SuperAdminRevenueAnalytics {
  currentMonth: number;
  previousMonth: number;
  yearToDate: number;
  averagePerTenant: number;
  topPerformingTenants: Array<{
    tenantId: string;
    tenantName: string;
    revenue: number;
    projectsCount: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    tenantCount: number;
  }>;
}
