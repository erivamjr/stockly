import { z } from "zod";

export const upsertSaleSchema = z.object({
  id: z.string().cuid().optional(),
  products: z.array(
    z.object({
      id: z.string().cuid(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export type CreateSaleSchema = z.infer<typeof upsertSaleSchema>;
