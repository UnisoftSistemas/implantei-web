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
