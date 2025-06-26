import type { ProjectStatus, Priority, StageStatus, ValidationType } from '@/types/Enums';
import type { User } from '@/types/User';
import type { Company } from '@/types/Company';
import type { System } from '@/types/System';

export interface Project {
  id: string;
  name: string;
  description?: string;
  companyId: string;
  systemId: string;
  consultantId: string;
  managerId: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string;
  estimatedEndDate?: string;
  actualEndDate?: string;
  budget?: number;
  clientAccessEnabled: boolean;
  clientAccessToken?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
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
  status: StageStatus;
  scheduledDate?: string;
  startDate?: string;
  completionDate?: string;
  plannedHours: number;
  actualHours?: number;
  notes?: string;
  responsibleId?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  responsible?: User;
  project?: Project;
}

export interface TimelineTemplate {
  id: string;
  name: string;
  description?: string;
  systemId: string;
  contractType: string;
  estimatedHours: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  system?: System;
}

export interface TemplateStage {
  id: string;
  templateId: string;
  name: string;
  description?: string;
  scope?: string;
  diagnosis?: string;
  impact?: string;
  sequenceOrder: number;
  estimatedHours: number;
  validationType: ValidationType;
  requiresClientValidation: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Relations
  template?: TimelineTemplate;
}