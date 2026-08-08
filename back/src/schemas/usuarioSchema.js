import { z } from "zod";

const createUsuarioSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter no mínimo 2 caracteres").max(100),
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  senha: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(72, "Senha muito longa"),
});

const updateUsuarioSchema = z.object({
  nome: z.string().trim().min(2).max(100).optional(),
});

export { createUsuarioSchema, updateUsuarioSchema };