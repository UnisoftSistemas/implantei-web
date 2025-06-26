import type { TicketType, TicketStatus, Priority } from "@/types/Enums";
import type { User } from "@/types/User";
import type { Project } from "@/types/Project";

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  projectId: string;
  createdBy: string;
  assignedTo?: string;
  type: TicketType;
  priority: Priority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;

  // Relations
  creator?: User;
  assignee?: User;
  project?: Project;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  attachmentPath?: string;
  isInternal: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations
  user?: User;
  ticket?: Ticket;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  waitingClient: number;
  resolved: number;
  closed: number;
}
