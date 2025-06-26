import type { ActivityType } from "@/types/Enums";
import type { Project } from "@/types/Project";

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalUsers: number;
  activeUsers: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  user?: {
    name: string;
    profileImageUrl?: string;
  };
  timestamp: string;
  relatedEntity?: {
    name: string;
    type: string;
  };
}

// Component props for dashboard
export interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

export interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
}

export interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}
