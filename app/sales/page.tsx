import Header, {
  HeaderLeft,
  HeaderSubtitle,
  HeaderTitle,
  HeaderRight,
} from "../_components/header";
import { DataTable } from "../_components/ui/data-table";
import { getProducts } from "../_data-access/product/get-products";
import { getSales } from "../_data-access/sale/get-sales";
import CreateSaleButton from "./_components/create-sale-button";
import { saleTableColumns } from "./_components/table-columns";

const Sales = async () => {
  const sales = await getSales();
  const products = await getProducts();
  const productOptions = products.map((product) => ({
    label: product.name,
    value: product.id,
  }));
  const tableData = sales.map((sale) => ({
    ...sale,
    products,
    productOptions,
  }));
  return (
    <div className="m-8 w-full space-y-8 rounded-lg bg-white p-8">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Gestão de Vendas</HeaderSubtitle>
          <HeaderTitle>Vendas</HeaderTitle>
        </HeaderLeft>
        <HeaderRight>
          <CreateSaleButton
            products={products}
            productOptions={productOptions}
          />
        </HeaderRight>
      </Header>

      <DataTable
        columns={saleTableColumns}
        data={JSON.parse(JSON.stringify(tableData))}
      />
    </div>
  );
};

export default Sales;
