"use client";

import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../_components/ui/badge";
import {
  CircleIcon,
  ClipboardCopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../_components/ui/dropdown-menu";
import { Button } from "../../_components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "../../_components/ui/alert-dialog";
import DeleteDialog from "./delete-dialog";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import UpsertProductDialog from "./upsert-product-dialog";
import { useState } from "react";

const getStatusLabel = (status: string) => {
  if (status === "IN_STOCK") return "Em estoque";
  return "Fora de estoque";
};

export const productTableColumns: ColumnDef<Product>[] = [
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
    cell: ({ row }) => {
      const [editDialogOpen, setEditDialogOpen] = useState(false);
      const product = row.original;
      return (
        <AlertDialog>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreHorizontalIcon size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-1.5"
                  onClick={() => navigator.clipboard.writeText(product.id)}
                >
                  <ClipboardCopyIcon size={16} /> Copiar ID
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem className="gap-1.5">
                    <EditIcon size={16} /> Editar
                  </DropdownMenuItem>
                </DialogTrigger>
                <AlertDialogTrigger>
                  <DropdownMenuItem className="gap-1.5">
                    <TrashIcon size={16} />
                    Deletar
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <UpsertProductDialog
              defaultValues={{
                id: product.id,
                name: product.name,
                price: Number(product.price),
                stock: product.stock,
              }}
              onSuccess={() => setEditDialogOpen(false)}
            />
            <DeleteDialog productId={product.id} />
          </Dialog>
        </AlertDialog>
      );
    },
  },
];
