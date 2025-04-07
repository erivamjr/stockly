import "server-only";
import { Product } from "@prisma/client";
import { db } from "../../_lib/prisma";
import { unstable_cache } from "next/cache";

export const getProducts = async (): Promise<Product[]> => {
  return db.product.findMany();
};

export const cachedGetProducts = unstable_cache(getProducts, ["get-products"], {
  revalidate: 60,
});
