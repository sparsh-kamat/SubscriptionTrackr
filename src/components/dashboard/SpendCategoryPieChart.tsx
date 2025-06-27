"use client";
import React from "react";
import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define an interface for the data prop
interface SpendPieChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

// Your 5 predefined chart colors from globals.css
const chartColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function SpendPieChart({ data }: SpendPieChartProps) {
  const { chartData, chartConfig } = React.useMemo(() => {
    const chartData = data.map((item, index) => ({
      name: item.name,
      value: item.value, // Ensure value is a string with 2 decimal places
      fill: chartColors[index % chartColors.length],
    }));

    const chartConfig = data.reduce(
      (config: ChartConfig, item, index) => {
        config[item.name] = {
          label: item.name,
          color: chartColors[index % chartColors.length],
        };
        return config;
      },
      {
        amount: {
          label: "Amount Spent: ",
        },
      }
    );

    return { chartData, chartConfig };
  }, [data]);

  return chartData.length === 0 ? (
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
      className="mx-auto max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
    >
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  // Use en-IN for Indian Rupee format
                  style: "currency",
                  currency: "INR", // Hardcode currency to INR
                }).format(value as number)
              }
            />
          }
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          labelLine={false}
          label={({ name }) => name}
        />
      </PieChart>
    </ChartContainer>
  );
}
