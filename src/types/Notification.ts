import type { NotificationType, NotificationStatus } from "@/types/Enums";
import type { User } from "@/types/User";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  actionUrl?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt: string;

  // Relations
  user?: User;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
}
