//boilerplate code placeholder
import {auth} from "@/lib/auth";
import { redirect } from "next/navigation";
import SubcriptionDasboard from "@/components/dashboard/SubscriptionDashboard";


export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <div className="flex w-full min-h-screen justify-evenly p-6 sm:pl-18 sm:pr-18 lg:pl-24 lg:pr-24 xl:pl-32 xl:pr-32">
      <SubcriptionDasboard/>
    </div>
  );
}
