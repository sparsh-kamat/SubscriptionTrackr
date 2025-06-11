"use client";
// import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { category: "entertainment", amount: 275, fill: "var(--color-chrome)" },
  { category: "internet", amount: 200, fill: "var(--color-safari)" },
  { category: "taxes", amount: 187, fill: "var(--color-firefox)" },
  { category: "lifestyle", amount: 173, fill: "var(--color-edge)" },
  { category: "food", amount: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  amount: {
    label: "Amount Spent: ",
  },
  chrome: {
    color: "hsl(var(--chart-1))",
  },
  safari: {
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    color: "hsl(var(--chart-3))",
  },
  edge: {
    color: "hsl(var(--chart-4))",
  },
  other: {
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function SpendPieChart() {
  return (
    chartData.length === 0 ? (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <span className="text-muted-foreground">No Data</span>
        </div>
        <h3 className="mt-6 text-lg font-semibold">No Spending Data Available</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          You don&apos;t have any spending data to display.
        </p>
      </div>
    ) : (
    <ChartContainer
      config={chartConfig}
      className="mx-auto  max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="amount"
          labelLine={false} // Set to true if you want lines from slice to label
          label={({ category }) => {
            // Access the 'browser' property from the data item
            // if (percent * 100 < 3) return null; // Optionally hide small labels
            return category; // Display the browser name as the label
          }}
          nameKey="category"
        ></Pie>
      </PieChart>
    </ChartContainer>
       )
  );
}
