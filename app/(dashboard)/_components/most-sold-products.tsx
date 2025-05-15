import { MostSoldProductDto } from "../../_data-access/dashboard/get-dashboard";
import ProductStatusBadge from "../../_components/product-status-badge";
import { formatCurrency } from "../../_helpers/currency";

interface MostSoldProductItemProps {
  product: MostSoldProductDto;
}

const MostSoldProdutcItem = ({ product }: MostSoldProductItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-[6px]">
        <ProductStatusBadge status={product.status} />
        <p className="font-semibold">{product.name}</p>
        <p className="font-medium text-slate-500">
          {formatCurrency(product.price)}
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold">{product.totalSold}</p>
      </div>
    </div>
  );
};

export default MostSoldProdutcItem;
