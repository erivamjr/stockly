import { z } from "zod";

export const upsertProductSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
  price: z
    .number()
    .int()
    .min(0.01, { message: "Preço deve ser maior que zero" }),
  stock: z.coerce
    .number()
    .positive({ message: "Quantidade deve ser positivo" })
    .min(0, { message: "Quantidade deve ser maior que zero" }),
});

export type UpsertProductSchema = z.infer<typeof upsertProductSchema>;
