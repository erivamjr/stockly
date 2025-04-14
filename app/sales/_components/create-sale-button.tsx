"use client";

import { Product } from "@prisma/client";
import { Button } from "../../_components/ui/button";
import { ComboboxOptionProps } from "../../_components/ui/combobox";
import { Sheet, SheetTrigger } from "../../_components/ui/sheet";
import UpsertSheetContent from "./upsert-sheet-content";
import { useState } from "react";

interface CreateSaleButtonProps {
  products: Product[];
  productOptions: ComboboxOptionProps[];
}
const CreateSaleButton = (props: CreateSaleButtonProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Nova venda</Button>
      </SheetTrigger>
      <UpsertSheetContent setSheetIsOpen={setOpen} {...props} />
    </Sheet>
  );
};

export default CreateSaleButton;
