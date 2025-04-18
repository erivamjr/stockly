"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../../_lib/prisma";
import { actionClient } from "../../../_lib/safe-action";
import { deleteSaleSchema } from "./schema";

export const deleteSale = actionClient
  .schema(deleteSaleSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.sale.delete({ where: { id } });
    revalidatePath("/sales");
  });
