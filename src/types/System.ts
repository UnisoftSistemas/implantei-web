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
