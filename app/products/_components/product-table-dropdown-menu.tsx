import { Product } from "@prisma/client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "../../_components/ui/alert-dialog";
import { Button } from "../../_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../_components/ui/dropdown-menu";
import {
  ClipboardCopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react";
import DeleteDialog from "./delete-dialog";
import UpsertProductDialog from "./upsert-product-dialog";
import { Dialog, DialogTrigger } from "../../_components/ui/dialog";
import { toast } from "sonner";

interface ProductTableDropdownMenuProps {
  product: Product;
}

const ProductTableDropdownMenu = ({
  product,
}: ProductTableDropdownMenuProps) => {
  const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);

  const handleCopyToClipboardClick = () => {
    navigator.clipboard.writeText(product.id);
    toast.success("ID copiado para a área de transferência.");
  };

  return (
    <AlertDialog>
      <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
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
              onClick={handleCopyToClipboardClick}
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
          setDialogIsOpen={setEditDialogIsOpen}
        />
        <DeleteDialog productId={product.id} />
      </Dialog>
    </AlertDialog>
  );
};

export default ProductTableDropdownMenu;
