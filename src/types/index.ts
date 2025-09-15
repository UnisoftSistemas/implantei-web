// Enums
export type * from "@/types/Enums";

// Core entities
export type * from "@/types/User";
export type * from "@/types/Company";
export type * from "@/types/System";
export type * from "@/types/Project";
export type * from "@/types/Task";
export type * from "@/types/Notification";
export type * from "@/types/Ticket";

// Dashboard and API
export type * from "@/types/Dashboard";
export type * from "@/types/Api";

// Re-export commonly used interfaces for backward compatibility
export type { User } from "@/types/User";
export type { Company } from "@/types/Company";
export type { System } from "@/types/System";
export type { Project, ProjectStage } from "@/types/Project";
export type { Task } from "@/types/Task";
export type { Notification } from "@/types/Notification";
export type { Ticket } from "@/types/Ticket";
export type { DashboardStats, Activity } from "@/types/Dashboard";
export type { ApiResponse, PaginatedResponse } from "@/types/Api";
export type { ITenant, ITenantUser, IFirebaseUser } from "@/types/Tenant";
