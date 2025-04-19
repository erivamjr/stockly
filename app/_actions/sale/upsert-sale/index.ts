"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../../_lib/prisma";
import { upsertSaleSchema } from "./schema";
import { actionClient } from "../../../_lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

export const upsertSale = actionClient
  .schema(upsertSaleSchema)
  .action(async ({ parsedInput: { products, id } }) => {
    const isUpdate = Boolean(id);
    await db.$transaction(async (tx) => {
      if (isUpdate) {
        const existingSale = await tx.sale.findUnique({
          where: { id },
          include: { saleProducts: true },
        });
        if (!existingSale) return;
        await tx.sale.delete({ where: { id } });
        for (const product of existingSale.saleProducts) {
          await tx.product.update({
            where: { id: product.productId },
            data: { stock: { increment: product.quantity } },
          });
        }
      }
      const sale = await tx.sale.create({ data: { date: new Date() } });

      for (const product of products) {
        const productFromDb = await tx.product.findUnique({
          where: { id: product.id },
        });
        if (!productFromDb) {
          returnValidationErrors(upsertSaleSchema, {
            _errors: ["Product not found"],
          });
        }

        const productIsOutOfStock = product.quantity > productFromDb.stock;
        if (productIsOutOfStock) {
          returnValidationErrors(upsertSaleSchema, {
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
    revalidatePath("/", "layout");
  });
