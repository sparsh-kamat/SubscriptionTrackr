"use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
//   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentSubscriptions = [
  {
    id: "1",
    name: "Netflix",
    category: "Entertainment",
    amount: 15.99,
    billingCycle: "Monthly",
    nextPayment: "2025-05-28",
    logo: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Spotify",
    category: "Entertainment",
    amount: 9.99,
    billingCycle: "Monthly",
    nextPayment: "2025-05-30",
    logo: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    category: "Productivity",
    amount: 52.99,
    billingCycle: "Monthly",
    nextPayment: "2025-06-02",
    logo: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Amazon Prime",
    category: "Shopping",
    amount: 14.99,
    billingCycle: "Monthly",
    nextPayment: "2025-06-10",
    logo: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Disney+",
    category: "Entertainment",
    amount: 7.99,
    billingCycle: "Monthly",
    nextPayment: "2025-06-15",
    logo: "/placeholder.svg",
  },
];
export default function SubsriptionList() {
  return (
    <Table className=" w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Cost </TableHead>
          <TableHead>Billing Cycle</TableHead>
          <TableHead>Next Payment</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentSubscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
                <TableCell className="flex items-center gap-2">
                <Image
                    src={subscription.logo}
                    alt={`${subscription.name} logo`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded"
                />
                {subscription.name}
                </TableCell>
                <TableCell>{subscription.category}</TableCell>
                <TableCell>${subscription.amount.toFixed(2)}</TableCell>
                <TableCell>{subscription.billingCycle}</TableCell>
                <TableCell>{new Date(subscription.nextPayment).toLocaleDateString()}</TableCell>
                <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <button className="p-2 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>

    </Table>
  );
}
