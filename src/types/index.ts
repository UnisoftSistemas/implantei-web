// Basic types for Sistema Implantei

export interface User {
  id: string;
  name: string;
  email: string;
  firebaseUid: string;
  phone?: string;
  role: "admin" | "manager" | "consultant" | "technician" | "client";
  profileImageUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  address?: string;
  phone?: string;
  email?: string;
  segment?: string;
  contactPerson?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface System {
  id: string;
  name: string;
  description?: string;
  version?: string;
  category?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  systemId: string;
  consultantId: string;
  managerId: string;
  status: "planning" | "in_progress" | "paused" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  startDate?: string;
  estimatedEndDate?: string;
  actualEndDate?: string;
  budget?: number;
  clientAccessEnabled: boolean;
  clientAccessToken?: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  system?: System;
  consultant?: User;
  manager?: User;
}

export interface ProjectStage {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  scope?: string;
  sequenceOrder: number;
  status: "pending" | "in_progress" | "completed" | "blocked";
  scheduledDate?: string;
  startDate?: string;
  completionDate?: string;
  plannedHours: number;
  actualHours?: number;
  notes?: string;
  responsibleId?: string;
  createdAt: string;
  updatedAt: string;
  responsible?: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  stageId?: string;
  assignedTo: string;
  createdBy: string;
  type: "task" | "bug" | "improvement" | "documentation";
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "review" | "completed" | "cancelled";
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User;
  creator?: User;
  project?: Project;
  stage?: ProjectStage;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  status: "unread" | "read";
  actionUrl?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: string;
  user?: User;
}

export interface ApiResponse<T> {
  user: User;
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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
