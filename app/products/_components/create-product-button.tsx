"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import UpsertProductDialog from "./upsert-product-dialog";
import { Dialog, DialogTrigger } from "../../_components/ui/dialog";
import { Button } from "../../_components/ui/button";

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
