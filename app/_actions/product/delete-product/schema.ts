import { z } from "zod";

export const deleteProductSchema = z.object({
  id: z.string().cuid(),
});

export type DeleteProductSchema = z.infer<typeof deleteProductSchema>;
