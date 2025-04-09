"use server";

import { revalidateTag } from "next/cache";
import { CreateProductSchema, createProductSchema } from "./schema";
import { db } from "../../../_lib/prisma";

export const createProduct = async (data: CreateProductSchema) => {
  createProductSchema.parse(data);
  await db.product.create({ data });
  revalidateTag("/products");
};
