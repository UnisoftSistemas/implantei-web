import { z } from "zod";

// User form schema for create/edit
export const userFormSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres"),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        if (!phone) return true; // Optional field
        const cleanPhone = phone.replace(/\D/g, "");
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
      },
      { message: "Telefone deve ter entre 10 e 11 dígitos" }
    ),
  role: z.enum(["admin", "manager", "consultant", "technician", "client"]),
  tenantCompanyId: z.string().min(1, "Empresa é obrigatória").optional(),
  active: z.boolean().default(true),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres")
    .optional(), // Optional for edit mode
});

// Create user schema (password required)
export const createUserFormSchema = userFormSchema.extend({
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres"),
});

// Update user schema (password optional)
export const updateUserFormSchema = userFormSchema.extend({
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres")
    .optional(),
});

// Role options for select components
export const USER_ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "manager", label: "Gerente" },
  { value: "consultant", label: "Consultor" },
  { value: "technician", label: "Técnico" },
  { value: "client", label: "Cliente" },
] as const;

export type UserFormData = z.infer<typeof userFormSchema>;
export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserFormSchema>;
