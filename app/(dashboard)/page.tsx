import { PackageIcon, ShoppingCartIcon } from "lucide-react";
import Header, {
  HeaderLeft,
  HeaderSubtitle,
  HeaderTitle,
} from "../_components/header";
import {
  SummaryCard,
  SummaryCardIcon,
  SummaryCardSkeleton,
  SummaryCardTitle,
  SummaryCardValue,
} from "./_components/summary-card";
import { getDashboard } from "../_data-access/dashboard/get-dashboard";
import RevenueChart from "./_components/revenue-chart";
import MostSoldProdutcItem from "./_components/most-sold-products";
import TotalRevenueCard from "./_components/total-revenue-card";
import { Suspense } from "react";
import TodayRevenueCard from "./_components/today-revenue-card";
import TotalSalesCard from "./_components/total-sales-card";
import TotalInStockCard from "./_components/total-in-stock-card";

const Home = async () => {
  const {
    totalStock,
    totalProducts,
    totalLast14DaysRevenue,
    mostSoldProducts,
  } = await getDashboard();
  return (
    <div className="m-8 flex w-full flex-col space-y-8 rounded-lg">
      <Header>
        <HeaderLeft>
          <HeaderSubtitle>Dashboard</HeaderSubtitle>
          <HeaderTitle>Dashboard</HeaderTitle>
        </HeaderLeft>
      </Header>

      <div className="grid grid-cols-2 gap-6">
        <Suspense fallback={<SummaryCardSkeleton />}>
          <TotalRevenueCard />
        </Suspense>

        <Suspense fallback={<SummaryCardSkeleton />}>
          <TodayRevenueCard />
        </Suspense>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Suspense fallback={<SummaryCardSkeleton />}>
          <TotalSalesCard />
        </Suspense>

        <Suspense fallback={<SummaryCardSkeleton />}>
          <TotalInStockCard />
        </Suspense>

        <SummaryCard>
          <SummaryCardIcon>
            <ShoppingCartIcon />
          </SummaryCardIcon>
          <SummaryCardTitle>Total em Estoque</SummaryCardTitle>
          <SummaryCardValue>{totalProducts}</SummaryCardValue>
        </SummaryCard>
      </div>

      <div className="grid min-h-0 grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-6">
        <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white p-6">
          <p className="text-lg font-semibold text-slate-900">Receita</p>
          <p className="text-sm text-slate-500">Últimos 14 dias</p>

          <RevenueChart data={totalLast14DaysRevenue} />
        </div>

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
      </div>
    </div>
  );
};

export default Home;
