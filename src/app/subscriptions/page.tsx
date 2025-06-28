import {auth} from "@/lib/auth";
import { redirect } from "next/navigation";
import AllSubscriptions from "@/components/subscription/AllSubscriptions";
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "All Subscriptions",
    description: "View, manage, filter, and sort all of your subscriptions in one place.",
  };

export default async function Subscriptions() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  return (
    <div className="flex w-full min-h-screen justify-evenly p-6 sm:pl-18 sm:pr-18 lg:pl-24 lg:pr-24 xl:pl-32 xl:pr-32">
      {/* Render the AllSubscriptions component */}
      <AllSubscriptions />
    </div>
  );
}
