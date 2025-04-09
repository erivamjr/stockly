"use server";

import { revalidatePath } from "next/cache";
import { UpsertProductSchema, upsertProductSchema } from "./schema";
import { db } from "../../../_lib/prisma";

export const upsertProduct = async (data: UpsertProductSchema) => {
  upsertProductSchema.parse(data);
  await db.product.upsert({
    where: { id: data.id || "" },
    update: data,
    create: data,
  });
  revalidatePath("/products");
};
