import { z } from "zod";

const anuncioBaseSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(80, "Título deve ter no máximo 80 caracteres"),
  descricao: z
    .string()
    .trim()
    .min(10, "Descrição deve ter no mínimo 10 caracteres"),
  tipo: z.enum(["VENDA", "DOACAO"]),
  preco: z.coerce.number().positive().optional().nullable(),
  categoriaId: z.coerce.number().int().positive(),
});

const createAnuncioSchema = anuncioBaseSchema.superRefine((data, ctx) => {
  if (data.tipo === "VENDA" && (data.preco === undefined || data.preco === null)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["preco"],
      message: "Preço é obrigatório para anúncios de venda",
    });
  }
});

const updateAnuncioSchema = anuncioBaseSchema.partial();

export { createAnuncioSchema, updateAnuncioSchema };