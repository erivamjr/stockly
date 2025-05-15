import "server-only";

import { db } from "../../_lib/prisma";
import dayjs from "dayjs";
import { ProductStatusDto } from "../product/get-products";

export interface DayTotalRevenueProps {
  day: string;
  totalRevenue: number;
}

export interface MostSoldProductDto {
  productId: string;
  name: string;
  totalSold: number;
  status: ProductStatusDto;
  price: number;
}

interface DashboardDto {
  totalRevenue: number;
  todayRevenue: number;
  totalSales: number;
  totalStock: number;
  totalProducts: number;
  totalLast14DaysRevenue: DayTotalRevenueProps[];
  mostSoldProducts: MostSoldProductDto[];
}

export const getDashboard = async (): Promise<DashboardDto> => {
  const today = dayjs().endOf("day").toDate();
  const last14Days = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((day) =>
    dayjs(today).subtract(day, "day"),
  );

  const totalLast14DaysRevenue: DayTotalRevenueProps[] = [];

  for (const day of last14Days) {
    const startOfDay = day.startOf("day").toDate();
    const endOfDay = day.endOf("day").toDate();
    const dayTotalRevenue = await db.saleProduct.aggregate({
      _sum: {
        unitPrice: true,
      },
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    totalLast14DaysRevenue.push({
      day: day.format("DD/MM"),
      totalRevenue: Number(dayTotalRevenue._sum.unitPrice) ?? 0,
    });
  }

  const totalRevenuePromise = db.saleProduct.aggregate({
    _sum: {
      unitPrice: true,
    },
  });

  const todayRevenuePromise = db.saleProduct.aggregate({
    _sum: {
      unitPrice: true,
    },
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lte: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  const totalSalesPromise = db.sale.count();

  const totalStockPromise = db.product.aggregate({
    _sum: {
      stock: true,
    },
  });

  const totalProductsPromise = db.product.count();

  const mostSoldProductsQuery = `
  SELECT "Product"."name", SUM("SaleProduct"."quantity") as "totalSold", "Product"."price", "Product"."stock", "Product"."id" as "productId"
  FROM "SaleProduct"
  JOIN "Product" ON "SaleProduct"."productId" = "Product"."id"
  GROUP BY "Product"."name", "Product"."price", "Product"."stock", "Product"."id"
  ORDER BY "totalSold" DESC
  LIMIT 10
  `;

  const mostSoldProductsPromise = db.$queryRawUnsafe<
    {
      productId: string;
      name: string;
      totalSold: number;
      stock: number;
      price: number;
    }[]
  >(mostSoldProductsQuery);

  const [
    totalRevenue,
    todayRevenue,
    totalSales,
    totalStock,
    totalProducts,
    mostSoldProducts,
  ] = await Promise.all([
    totalRevenuePromise,
    todayRevenuePromise,
    totalSalesPromise,
    totalStockPromise,
    totalProductsPromise,
    mostSoldProductsPromise,
  ]);

  return {
    totalRevenue: Number(totalRevenue._sum.unitPrice) ?? 0,
    todayRevenue: Number(todayRevenue._sum.unitPrice) ?? 0,
    totalSales,
    totalStock: Number(totalStock._sum.stock) ?? 0,
    totalProducts,
    totalLast14DaysRevenue,
    mostSoldProducts: mostSoldProducts.map((product) => ({
      ...product,
      totalSold: Number(product.totalSold) ?? 0,
      price: Number(product.price) ?? 0,
      status: product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
    })),
  };
};
