"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SaleDto } from "../../_data-access/sale/get-sales";
import { formatCurrency } from "../../_helpers/currency";
import SalesTableDropdownMenu from "./table-dropdown-menu";
import { ProductDto } from "../../_data-access/product/get-products";
import { ComboboxOptionProps } from "../../_components/ui/combobox";

interface SalesTableColumn extends SaleDto {
  products: ProductDto[];
  productOptions: ComboboxOptionProps[];
}

export const saleTableColumns: ColumnDef<SalesTableColumn>[] = [
  {
    accessorKey: "productName",
    header: "Produtos",
  },
  {
    accessorKey: "totalProducts",
    header: "Quantidade de Produtos",
  },
  {
    header: "Valor Total",
    cell: ({
      row: {
        original: { totalAmount },
      },
    }) => formatCurrency(totalAmount),
  },
  {
    header: "Data",
    cell: ({
      row: {
        original: { date },
      },
    }) => new Date(date).toLocaleDateString("pt-BR"),
  },
  {
    header: "Açoes",
    cell: ({ row: { original: sale } }) => {
      return (
        <SalesTableDropdownMenu
          sale={sale}
          products={sale.products}
          productOptions={sale.productOptions}
        />
      );
    },
  },
];
