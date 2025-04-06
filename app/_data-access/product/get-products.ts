import "server-only";
import { Product } from "@prisma/client";
import { db } from "../../_lib/prisma";

export const getProducts = async (): Promise<Product[]> => {
  return db.product.findMany();
};
