import { db } from "../../_lib/prisma";

export interface SaleDto {
  id: string;
  productName: string;
  totalProducts: number;
  totalAmount: number;
  date: Date;
}

export const getSales = async (): Promise<SaleDto[]> => {
  const sales = await db.sale.findMany({
    include: {
      saleProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return sales.map((sale) => ({
    id: sale.id,
    date: sale.date,
    productName: sale.saleProducts.map((sp) => sp.product.name).join(" * "),
    totalAmount: sale.saleProducts.reduce(
      (acc, curr) => acc + Number(curr.unitPrice),
      0,
    ),
    totalProducts: sale.saleProducts.reduce(
      (acc, curr) => acc + Number(curr.quantity),
      0,
    ),
  }));
};
