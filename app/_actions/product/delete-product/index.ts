"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../../_lib/prisma";
import { deleteProductSchema } from "./schema";
import { actionClient } from "../../../_lib/safe-action";

export const deleteProduct = actionClient
  .schema(deleteProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.product.delete({ where: { id } });
    revalidatePath("/products");
  });
