"use client";

import { z } from "zod";
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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Product } from "@prisma/client";
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
import SalesTableDropdownMenu from "./sales-table-dropdown-menu";
import { createSale } from "../../_actions/sale/create-sale";
import { toast } from "sonner";

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

interface UpsertSheetContentProps {
  products: Product[];
  productOptions: ComboboxOptionProps[];
  setSheetIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const UpsertSheetContent = ({
  products,
  productOptions,
  setSheetIsOpen,
}: UpsertSheetContentProps) => {
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct[]>([]);
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
    },
  });

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
    try {
      await createSale({
        products: selectedProduct.map((product) => ({
          id: product.id,
          quantity: product.quantity,
        })),
      });
      toast.success("Venda realizada com sucesso!");
      setSheetIsOpen(false);
    } catch (error) {
      toast.error("Erro ao realizar venda!");
    }
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
                <SalesTableDropdownMenu product={product} onDelete={onDelete} />
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
