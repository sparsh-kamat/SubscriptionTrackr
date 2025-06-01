// src/app/add/page.tsx
"use server";

import {auth} from "@/lib/auth";
import { redirect } from "next/navigation";
import AddSubscriptionCard from "@/components/subscription/AddSubscriptionCard";

// You might want to define these lists centrally or fetch them if they become dynamic

export default async function AddSubscriptionPage() {
    const session = await auth();
    if (!session?.user) {
      redirect("/auth/signin");
    } 
  return (
    // Centering container
    <div className="flex flex-col flex-grow items-center justify-center bg-muted/40 px-4 py-4 ">
      <AddSubscriptionCard />
    </div>
  );
}
// This code is a complete React component for adding a subscription.
