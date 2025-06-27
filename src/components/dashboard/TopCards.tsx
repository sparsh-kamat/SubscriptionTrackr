"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// Define the props that this component will receive
interface TopCardsProps {
  totalMonthlyCost: number;
  activeSubscriptionsCount: number;
  totalYearlyCost: number;
  upcomingRenewalsCount: number;
  monthlyCostChange: number; // Optional, can be calculated if needed
  activeSubscriptionsChange: number; // Optional, can be calculated if needed
}

export default function TopCards({
  totalMonthlyCost,
  activeSubscriptionsCount,
  totalYearlyCost,
  upcomingRenewalsCount,
  monthlyCostChange = 0, // Default to 0 if not provided
  activeSubscriptionsChange = 0, // Default to 0 if not provided
}: TopCardsProps) {
  //LOG
  console.log("TopCards Props:", {
    totalMonthlyCost,
    activeSubscriptionsCount,
    totalYearlyCost,
    upcomingRenewalsCount,
  });

  return (
    <div className="grid gap-4 xs:grid-cols-1 md:grid-cols-2  lg:grid-cols-4 h-fit p-4  w-full">
      <Card className="gap-3">
        <CardHeader className="flex flex-row items-center justify-between  ">
          <CardTitle className="text-m font-medium">
            Total Monthly Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Rs. {totalMonthlyCost.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {monthlyCostChange >= 0
              ? "+ " + monthlyCostChange.toFixed(2) + " from last month"
                : monthlyCostChange.toFixed(2) + " from last month"}
          </p>
        </CardContent>
      </Card>
      <Card className="gap-3">
        <CardHeader className="flex flex-row items-center justify-between ">
          <CardTitle className="text-m font-medium">
            Active Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> {activeSubscriptionsCount}</div>
          <p className="text-xs text-muted-foreground">
            {activeSubscriptionsChange > 0
              ? "+ " + activeSubscriptionsChange + " from last month"
              :  " same as last month"}
            </p>
        </CardContent>
      </Card>
      <Card className="gap-3">
        <CardHeader className="flex flex-row items-center justify-between ">
          <CardTitle className="text-m font-medium">Annual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rs.{totalYearlyCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Based on current subscriptions
          </p>
        </CardContent>
      </Card>
      <Card className="gap-3">
        <CardHeader className="flex flex-row items-center justify-between ">
          <CardTitle>Upcoming Renewals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingRenewalsCount}</div>
          <p className="text-xs text-muted-foreground">In the next 15 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
