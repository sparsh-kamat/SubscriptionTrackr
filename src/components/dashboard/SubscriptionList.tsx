"use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
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
import { type Subscription } from "@prisma/client";

// Define the props for the component
interface SubscriptionListProps {
  recentSubscriptions: Subscription[];
  onSubscriptionDeleted: () => void; // Callback for when a subscription is deleted
  onEditSubscription: (subscription: Subscription) => void; // Callback to start editing a subscription
}


export default function SSubsriptionList({
  recentSubscriptions = [],
  onSubscriptionDeleted,
  onEditSubscription,
}: SubscriptionListProps) {
  async function deleteSubscription(id: string) {
    // Placeholder for delete logic
    console.log(`Delete subscription with id: ${id}`);

    // You can implement the actual deletion logic here
    // For example, you might want to call an API endpoint to delete the subscription
    try {
      // Call your API to delete the subscription
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete subscription with id ${id}`);
      }
      onSubscriptionDeleted?.(); // Call the callback if provided
      //remove the subscription from the UI or update the state accordingly
      // For example, you might want to refetch the subscriptions or update the local state

      console.log(`Subscription with id ${id} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete subscription with id ${id}:`, error);
    }
    // Optionally, you can return a success message or handle the UI update
  }
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
              {/* <Image
                    src={subscription.logo}
                    alt={`${subscription.name} logo`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded"
                /> */}
              {subscription.name}
            </TableCell>
            <TableCell>{subscription.category}</TableCell>
            <TableCell>
              {subscription.currency + " " + subscription.cost}
            </TableCell>
            <TableCell>{subscription.billingCycle}</TableCell>
            <TableCell>
              {new Date(subscription.nextBillingDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={()=> onEditSubscription(subscription)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteSubscription(subscription.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
