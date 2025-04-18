import { db } from "../../_lib/prisma";

interface SaleProductDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  productName: string;
}
export interface SaleDto {
  id: string;
  productName: string;
  totalProducts: number;
  totalAmount: number;
  date: Date;
  saleProducts: SaleProductDto[];
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
    saleProducts: sale.saleProducts.map(
      (sp): SaleProductDto => ({
        productId: sp.productId,
        productName: sp.product.name,
        quantity: sp.quantity,
        unitPrice: Number(sp.unitPrice),
      }),
    ),
  }));
};
