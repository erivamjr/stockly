"use client";

import { Button } from "../../_components/ui/button";
import { ComboboxOptionProps } from "../../_components/ui/combobox";
import { Sheet, SheetTrigger } from "../../_components/ui/sheet";
import UpsertSheetContent from "./upsert-sheet-content";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { ProductDto } from "../../_data-access/product/get-products";

interface CreateSaleButtonProps {
  products: ProductDto[];
  productOptions: ComboboxOptionProps[];
}
const CreateSaleButton = (props: CreateSaleButtonProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon size={20} className="gap-2" />
          Nova venda
        </Button>
      </SheetTrigger>
      <UpsertSheetContent isOpen={open} setSheetIsOpen={setOpen} {...props} />
    </Sheet>
  );
};

export default CreateSaleButton;
