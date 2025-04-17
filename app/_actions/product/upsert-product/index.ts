"use server";

import { revalidatePath } from "next/cache";
import { upsertProductSchema } from "./schema";
import { db } from "../../../_lib/prisma";
import { actionClient } from "../../../_lib/safe-action";

export const upsertProduct = actionClient
  .schema(upsertProductSchema)
  .action(async ({ parsedInput: { id, ...data } }) => {
    upsertProductSchema.parse(data);
    await db.product.upsert({
      where: { id: id ?? "" },
      update: data,
      create: data,
    });
    revalidatePath("/products");
  });
