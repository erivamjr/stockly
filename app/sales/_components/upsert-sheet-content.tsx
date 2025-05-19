"use client";

import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../_components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../_components/ui/form";
import { Input } from "../../_components/ui/input";
import Combobox, { ComboboxOptionProps } from "../../_components/ui/combobox";
import { Button } from "../../_components/ui/button";
import { CheckIcon, PlusIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../_components/ui/table";
import { formatCurrency } from "../../_helpers/currency";
import UpsertSalesTableDropdownMenu from "./upsert-table-dropdown-menu";
import { upsertSale } from "../../_actions/sale/upsert-sale";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { flattenValidationErrors } from "next-safe-action";
import { ProductDto } from "../../_data-access/product/get-products";
import { z } from "zod";

const formSchema = z.object({
  productId: z.string().cuid({
    message: "O produto é obrigatório.",
  }),
  quantity: z.coerce
    .number()
    .int()
    .positive({ message: "Quantidade deve ser positiva" }),
});

type FormSchema = z.infer<typeof formSchema>;

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface UpsertSheetContentProps {
  isOpen: boolean;
  saleId?: string;
  products: ProductDto[];
  productOptions: ComboboxOptionProps[];
  setSheetIsOpen: Dispatch<SetStateAction<boolean>>;
  defaultSelectedProducts?: SelectedProduct[];
}

const UpsertSheetContent = ({
  isOpen,
  saleId,
  products,
  productOptions,
  setSheetIsOpen,
  defaultSelectedProducts,
}: UpsertSheetContentProps) => {
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct[]>(
    defaultSelectedProducts || [],
  );
  const { execute: executeCreateSale } = useAction(upsertSale, {
    onError: ({ error: { validationErrors, serverError } }) => {
      const flattenedErrors = flattenValidationErrors(validationErrors);
      toast.error(serverError || flattenedErrors.formErrors[0]);
    },
    onSuccess: () => {
      toast.success("Venda realizada com sucesso!");
      setSheetIsOpen(false);
    },
  });
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setSelectedProduct([]);
    }
  }, [isOpen, form]);

  useEffect(() => {
    if (defaultSelectedProducts) {
      setSelectedProduct(defaultSelectedProducts ?? []);
    }
  }, [defaultSelectedProducts]);

  const onSubmit = async (data: FormSchema) => {
    const seletedProduct = products.find(
      (product) => product.id === data.productId,
    );
    if (!seletedProduct) return;

    setSelectedProduct((currencyProduct) => {
      const productExists = currencyProduct.find(
        (p) => p.id === seletedProduct.id,
      );
      if (productExists) {
        const productIsOutOfStock =
          productExists.quantity + data.quantity > seletedProduct.stock;
        if (productIsOutOfStock) {
          form.setError("quantity", {
            message: "Quantidade indisponível",
          });
          return currencyProduct;
        }
        form.reset();
        return currencyProduct.map((p) => {
          if (p.id === seletedProduct.id) {
            return { ...p, quantity: p.quantity + data.quantity };
          }
          return p;
        });
      }
      const productIsOutOfStock = data.quantity > seletedProduct.stock;
      if (productIsOutOfStock) {
        form.setError("quantity", {
          message: "Quantidade indisponível",
        });
        return currencyProduct;
      }
      form.reset();
      return [
        ...currencyProduct,
        {
          ...seletedProduct,
          price: Number(seletedProduct.price),
          quantity: data.quantity,
        },
      ];
    });
  };

  const productsTotal = useMemo(() => {
    return selectedProduct.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  }, [selectedProduct]);

  const onDelete = (productId: string) => {
    setSelectedProduct((products) => {
      return products.filter((product) => product.id !== productId);
    });
  };

  const onSubmitSales = async () => {
    executeCreateSale({
      id: saleId,
      products: selectedProduct.map((p) => ({
        id: p.id,
        quantity: p.quantity,
      })),
    });
  };

  return (
    <SheetContent className="!max-w-2xl">
      <SheetHeader>
        <SheetTitle>Nova Venda</SheetTitle>
        <SheetDescription>
          Insira as informações da venda abaixo.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form className="space-y-6 py-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Produto</FormLabel>
                <FormControl>
                  <Combobox
                    placeholder="Selecione um produto"
                    options={productOptions}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Produto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Digite a quantidade"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full gap-2" variant={"secondary"} type="submit">
            <PlusIcon size={20} />
            Adicionar Produto a venda
          </Button>
        </form>
      </Form>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Preço Unitário</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProduct.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                {formatCurrency(product.price * product.quantity)}
              </TableCell>
              <TableCell>
                <UpsertSalesTableDropdownMenu
                  product={product}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell>{formatCurrency(productsTotal)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <SheetFooter className="pt-6">
        <Button
          type="submit"
          className="w-full gap-2"
          disabled={!selectedProduct.length}
          onClick={onSubmitSales}
        >
          <CheckIcon size={20} />
          Finalizar venda
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default UpsertSheetContent;
