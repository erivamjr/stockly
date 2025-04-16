"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../../_lib/prisma";
import { createSaleSchema } from "./schema";
import { actionClient } from "../../../_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

export const createSale = actionClient
  .schema(createSaleSchema)
  .action(async ({ parsedInput: { products } }) => {
    await db.$transaction(async (tx) => {
      const sale = await tx.sale.create({ data: { date: new Date() } });

      for (const product of products) {
        const productFromDb = await db.product.findUnique({
          where: { id: product.id },
        });
        if (!productFromDb) {
          returnValidationErrors(createSaleSchema, {
            _errors: ["Product not found"],
          });
        }

        const productIsOutOfStock = product.quantity > productFromDb.stock;
        if (productIsOutOfStock) {
          returnValidationErrors(createSaleSchema, {
            _errors: ["Product is out of stock"],
          });
        }
        await tx.saleProduct.create({
          data: {
            saleId: sale.id,
            productId: product.id,
            quantity: product.quantity,
            unitPrice: productFromDb.price,
          },
        });

        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: product.quantity } },
        });
      }
    });
    revalidatePath("/products");
  });
