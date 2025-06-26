export interface Activity {
  id: string;
  type:
    | "project_update"
    | "task_completed"
    | "company_created"
    | "stage_completed"
    | "ticket_created";
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

export interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
}
