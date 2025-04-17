"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogTrigger } from "@/app/_components/ui/dialog";
import { useState } from "react";
import UpsertProductDialog from "./upsert-product-dialog";

{
  /* <NumericFormat value="20020220" allowLeadingZeros thousandSeparator="," />; */
}

const CreateProductButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon size={20} className="gap-2" />
          Novo produto
        </Button>
      </DialogTrigger>
      <UpsertProductDialog setDialogIsOpen={setDialogIsOpen} />
    </Dialog>
  );
};

export default CreateProductButton;
