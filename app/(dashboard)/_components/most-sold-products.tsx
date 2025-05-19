import { Skeleton } from "../../_components/ui/skeleton";
import { getMostSoldProducts } from "../../_data-access/dashboard/get-most-sold-products";
import MostSoldProdutcItem, {
  MostSoldProductItemSkeleton,
} from "./most-sold-product-item";

const MostSoldProducts = async () => {
  const mostSoldProducts = await getMostSoldProducts();
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white">
      <p className="p-6 text-lg font-semibold text-slate-900">
        Produtos mais vendidos
      </p>

      <div className="mb-6 space-y-7 overflow-y-auto px-6 pb-6">
        {mostSoldProducts.map((product) => (
          <MostSoldProdutcItem key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export const MostSoldProductsSkeleton = () => {
  return (
    <Skeleton className="bg-white p-6">
      <div className="space-y-2">
        <div className="h-5 w-[86.26px] rounded-md bg-gray-200" />
        <div className="h-4 w-48 rounded-md bg-gray-200" />
        <MostSoldProductItemSkeleton />
        <MostSoldProductItemSkeleton />
        <MostSoldProductItemSkeleton />
      </div>
    </Skeleton>
  );
};

export default MostSoldProducts;
