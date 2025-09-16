import { z } from "zod";
import { isValidCNPJ } from "@/utils/cnpj";

// Tenant form schema
export const tenantFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),

  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .refine(isValidCNPJ, "CNPJ inválido"),

  email: z.email("E-mail inválido").optional().or(z.literal("")),

  phone: z.string().optional(),

  segment: z.string().optional(),

  contactPerson: z.string().optional(),

  active: z.boolean().default(true),

  isTenant: z.boolean().default(true),
});

// Export the type
export type TenantFormData = z.infer<typeof tenantFormSchema>;
