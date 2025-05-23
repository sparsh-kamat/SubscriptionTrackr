"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SubscriptionsDashboard() {
  return (
    <Card className="flex flex-col border  w-full items-center gap-0 p-0 ">
      <div className=" flex flex-col sm:flex-row h-fit justify-between  w-full p-4">
        <div className="flex items-center gap-4 ">
          <h1 className="text-2xl font-bold "> Dashboard</h1>
        </div>
        <div className="flex items-center justify-end gap-4 ">
          <Link href="/add">
            <Button className="gap-1 ">
              <PlusCircle className="h-4 w-4" />
              Add Subscription
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 xs:grid-cols-1 md:grid-cols-2  lg:grid-cols-4 h-fit p-4  w-full">
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between  ">
            <CardTitle className="text-m font-medium">
              Total Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89.99</div>
            <p className="text-xs text-muted-foreground">
              +$12.99 from last month
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-m font-medium">
              Annual Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,079.88</div>
            <p className="text-xs text-muted-foreground">
              Based on current subscriptions
            </p>
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-m font-medium">
              Upcoming Renewals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">In the next 15 days</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-7 h-90 p-4  w-full">
        <Card className="lg:col-span-3 ">
          {/* pie chart of spends by catergory */}
        </Card>
        <Card className="lg:col-span-4">
          {/* Upcoming subcription payments */}
        </Card>
      </div>
      <div className=" flex p-4 min-h-3/6  w-full">
        <Card className="flex w-full ">
          {/* Upcoming subcription payments */}

          <Table className=" flex min-h-60  w-full "></Table>
          {/* all subscriptions */}
        </Card>
      </div>
    </Card>
  );
}
