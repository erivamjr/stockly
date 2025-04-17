"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../_components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { SaleDto } from "../../_data-access/sale/get-sales";
import { formatCurrency } from "../../_helpers/currency";

export const saleTableColumns: ColumnDef<SaleDto>[] = [
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
    cell: () => (
      <Button>
        <MoreHorizontalIcon size={16} />
      </Button>
    ),
  },
];
