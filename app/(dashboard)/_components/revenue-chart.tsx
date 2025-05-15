"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { DayTotalRevenueProps } from "../../_data-access/dashboard/get-dashboard";
import { ChartConfig, ChartContainer } from "../../_components/ui/chart";

const chartConfig: ChartConfig = {
  totalRevenue: {
    label: "Receita",
  },
};

interface RevenueChartProps {
  data: DayTotalRevenueProps[];
}
const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="min-h-0 w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={"day"}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <Bar dataKey={"totalRevenue"} radius={4} />
      </BarChart>
    </ChartContainer>
  );
};

export default RevenueChart;
