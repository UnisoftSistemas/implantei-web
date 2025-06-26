// User roles
export type UserRole =
  | "admin"
  | "manager"
  | "consultant"
  | "technician"
  | "client";

// Contract types
export type ContractType = "basic" | "standard" | "premium";

// Validation types
export type ValidationType = "checklist" | "upload" | "confirmation";

// Project status - UPDATED to match Prisma schema
export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "validation"
  | "completed"
  | "cancelled"
  | "on_hold";

// Priority levels
export type Priority = "low" | "medium" | "high" | "urgent";

// Stage status - UPDATED to match Prisma schema
export type StageStatus =
  | "pending"
  | "in_progress"
  | "validation"
  | "completed"
  | "skipped";

// Task types - UPDATED to match Prisma schema
export type TaskType = "internal" | "client" | "validation" | "follow_up";

// Task status - UPDATED to match Prisma schema
export type TaskStatus =
  | "todo"
  | "in_progress"
  | "review"
  | "completed"
  | "cancelled";

// Notification types - NEW from Prisma schema
export type NotificationType =
  | "project_assigned"
  | "task_assigned"
  | "deadline_warning"
  | "stage_completed"
  | "validation_required";

// Notification status - UPDATED to match Prisma schema
export type NotificationStatus = "unread" | "read" | "archived";

// Ticket types - NEW from Prisma schema
export type TicketType = "question" | "issue" | "request" | "feedback";

// Ticket status - NEW from Prisma schema
export type TicketStatus =
  | "open"
  | "in_progress"
  | "waiting_client"
  | "resolved"
  | "closed";

// Dashboard activity types - keeping existing for compatibility
export type ActivityType =
  | "project_update"
  | "task_completed"
  | "company_created"
  | "stage_completed"
  | "ticket_created";
