"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../_components/ui/badge";
import { CircleIcon } from "lucide-react";
import ProductTableDropdownMenu from "./product-table-dropdown-menu";
import { ProductDto } from "../../_data-access/product/get-products";

const getStatusLabel = (status: string) => {
  if (status === "IN_STOCK") return "Em estoque";
  return "Fora de estoque";
};

export const productTableColumns: ColumnDef<ProductDto>[] = [
  {
    accessorKey: "name",
    header: "Produto",
  },
  {
    accessorKey: "price",
    header: "Valor Unitário",
    cell: ({ row }) => {
      const product = row.original;
      return Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(product.price));
    },
  },

  {
    accessorKey: "stock",
    header: "Estoque",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original;
      const label = getStatusLabel(product.status);
      return (
        <Badge
          variant={label === "Em estoque" ? "default" : "outline"}
          className="gap-1.5"
        >
          <CircleIcon
            size={12}
            className={`${label === "Em estoque" ? "fill-primary-foreground" : "fill-destructive-foreground"}`}
          />

          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => <ProductTableDropdownMenu product={row.original} />,
  },
];
