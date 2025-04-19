"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../../_lib/prisma";
import { actionClient } from "../../../_lib/safe-action";
import { deleteSaleSchema } from "./schema";

export const deleteSale = actionClient
  .schema(deleteSaleSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.$transaction(async (tx) => {
      const sales = await tx.sale.findUnique({
        where: { id },
        include: { saleProducts: true },
      });

      if (!sales) return;

      await tx.sale.delete({ where: { id } });

      for (const product of sales.saleProducts) {
        await tx.product.update({
          where: { id: product.productId },
          data: { stock: { increment: product.quantity } },
        });
      }
    });
    revalidatePath("/sales");
    revalidatePath("/products");
    revalidatePath("/");
  });
