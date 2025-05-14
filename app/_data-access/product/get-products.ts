import "server-only";
import { Product } from "@prisma/client";
import { db } from "../../_lib/prisma";
import { unstable_cache } from "next/cache";

export type ProductStatusDto = "IN_STOCK" | "OUT_OF_STOCK";

export interface ProductDto extends Product {
  status: ProductStatusDto;
}

export const getProducts = async (): Promise<ProductDto[]> => {
  const products = await db.product.findMany({});

  return products.map((product) => ({
    ...product,
    status: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
  }));
};

export const cachedGetProducts = unstable_cache(getProducts, ["getProducts"], {
  tags: ["get-products"],
  revalidate: 60,
});
