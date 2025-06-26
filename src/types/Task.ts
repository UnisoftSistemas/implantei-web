// File: src/types/task.ts
// Task related interfaces and types

import type { TaskType, TaskStatus, Priority } from "@/types/Enums";
import type { User } from "@/types/User";
import type { Project, ProjectStage } from "@/types/Project";

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  stageId?: string;
  assignedTo: string;
  createdBy: string;
  type: TaskType;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
  completedAt?: string;
  isOverdue?: boolean; // Computed field from backend
  createdAt: string;
  updatedAt: string;

  // Relations
  assignee?: User;
  creator?: User;
  project?: Project;
  stage?: ProjectStage;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  attachmentPath?: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
  task?: Task;
}

// Task-related props for components
export interface TaskItemProps {
  task: Task;
  onToggle?: (taskId: string) => void;
  showProject?: boolean;
  compact?: boolean;
}
