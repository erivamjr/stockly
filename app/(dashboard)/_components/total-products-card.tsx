import { ShoppingCartIcon } from "lucide-react";
import { getTotalProducts } from "../../_data-access/dashboard/get-total-products";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardTitle,
  SummaryCardValue,
} from "./summary-card";

const TotalProductsCard = () => {
  const totalProducts = getTotalProducts();
  return (
    <SummaryCard>
      <SummaryCardIcon>
        <ShoppingCartIcon />
      </SummaryCardIcon>
      <SummaryCardTitle>Total em Estoque</SummaryCardTitle>
      <SummaryCardValue>{totalProducts}</SummaryCardValue>
    </SummaryCard>
  );
};

export default TotalProductsCard;
