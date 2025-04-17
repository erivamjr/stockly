"use client";

import { NumericFormat } from "react-number-format";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../_components/ui/form";
import { Input } from "../../_components/ui/input";
import { Button } from "../../_components/ui/button";
import { Loader2Icon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpsertProductSchema,
  upsertProductSchema,
} from "../../_actions/product/upsert-product/schema";
import { upsertProduct } from "../../_actions/product/upsert-product";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

interface UpsertProductDialogProps {
  defaultValues?: UpsertProductSchema;
  setDialogIsOpen: Dispatch<SetStateAction<boolean>>;
}

const UpsertProductDialog = ({
  defaultValues,
  setDialogIsOpen,
}: UpsertProductDialogProps) => {
  const { execute: executeUpsertProduct } = useAction(upsertProduct, {
    onSuccess: () => {
      toast.success("Produto salvo com sucesso!");
      setDialogIsOpen(false);
      form.reset();
    },
    onError: () => {
      toast.error("Ocorreu um erro ao salvar produto!");
    },
  });
  const form = useForm<UpsertProductSchema>({
    resolver: zodResolver(upsertProductSchema),
    defaultValues: defaultValues ?? {
      id: "",
      name: "",
      price: 0,
      stock: 1,
    },
  });

  // const onSubmit = (data: UpsertProductSchema) => {
  //   executeUpsertProduct({ ...data, id: defaultValues?.id });
  // };

  const isEditing = !!defaultValues;

  return (
    <DialogContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(executeUpsertProduct)}
          className="space-y-8"
        >
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar" : "Criar"} Produto</DialogTitle>
            <DialogDescription>Insira as informações abaixo</DialogDescription>
          </DialogHeader>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do produto</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do produto" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço do produto</FormLabel>
                <FormControl>
                  <NumericFormat
                    placeholder="Digite o preço do produto"
                    thousandSeparator="."
                    decimalSeparator=","
                    fixedDecimalScale
                    decimalScale={2}
                    prefix="R$ "
                    allowNegative={false}
                    customInput={Input}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    {...field}
                    onChange={() => {}}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do produto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Digite o estoque do produto"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2Icon className="mr-1.5 h-4 w-4 animate-spin" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertProductDialog;
