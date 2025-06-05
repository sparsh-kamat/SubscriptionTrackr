import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateNormalizedMonthlyCost, calculateNormalizedYearlyCost } from "@/lib/subscription-utils";
import { getDaysRemaining } from "@/lib/subscription-utils";
import { type Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface UpcomingRenewal extends Subscription {
    daysUntilRenewal: number | null; // Days until the next billing date, null if not applicable
}

interface CategorySpending {
    name: string;
    value: number;
}

interface DashboardData {
    totalMonthlyCost: number;
    totalYearlyCost: number;
    activeSubscriptions: number;
    numberOfUpcomingRenewals: number;
    upcomingRenewals: UpcomingRenewal[];
    categorySpending: CategorySpending[];
    recentSubscriptions: Subscription[];
    categorywiseSpending: CategorySpending[];
}

export async function GET(){
    // Authenticate the user
    const session = await auth();
    if (!session){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Step by step, we will fetch the data from the database and perform calculations
    const userId = session.user.id;
    const fetchedSubscriptions = await prisma.subscription.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    const activeSubscriptions = fetchedSubscriptions.filter((sub: Subscription) => sub.status?.toLowerCase() === "active");


    //if there are no active subscriptions, return null
    if (activeSubscriptions.length === 0) {
        return NextResponse.json({ message: "No active subscriptions found." }, { status: 200 });
    }


    // Calculate total monthly and yearly costs, active subscriptions, and upcoming renewals
    let totalMonthlyCost = 0;
    let totalYearlyCost = 0;
    

    activeSubscriptions.forEach((sub: Subscription) => {
        totalMonthlyCost += calculateNormalizedMonthlyCost(sub.cost, sub.billingCycle);
        totalYearlyCost += calculateNormalizedYearlyCost(sub.cost, sub.billingCycle);
    });

    //total active subscriptions
    const totalActiveSubscriptions = activeSubscriptions.length;

    // Get upcoming renewals
    //current date/time 
    const now_server = new Date();
    const fifteenDaysFromNow = new Date(now_server.getTime() + 15 * 24 * 60 * 60 * 1000);

    const upcomingRenewals = activeSubscriptions
        .filter((sub: Subscription) => { 
            if (!sub.nextBillingDate) return false;
            const nextBillingDate = new Date(sub.nextBillingDate);
            return nextBillingDate >= now_server && nextBillingDate <= fifteenDaysFromNow;
        })
        .map((sub: Subscription) => {
            return {
                ...sub,
                daysUntilRenewal: getDaysRemaining(sub.nextBillingDate),
            };
        })
        .sort((a, b) => new Date(a.nextBillingDate!).getTime() - new Date(b.nextBillingDate!).getTime());

    const numberOfUpcomingRenewals = upcomingRenewals.length;
    
    const recentSubscriptions = fetchedSubscriptions.slice(0, 5);

    // Calculate category spending
    const spendingByCategory: { [key: string]: number } = {};
    activeSubscriptions.forEach((sub: Subscription) => {
        if (sub.category) {
            const normalizedCost = calculateNormalizedYearlyCost(sub.cost, sub.billingCycle);
            spendingByCategory[sub.category] = (spendingByCategory[sub.category] || 0) + normalizedCost;
        }
    });

    const categorySpending: CategorySpending[] = Object.entries(spendingByCategory).map(([name, value]) => ({
        name,
        value,
    }));

    // Prepare the final dashboard data
    const dashboardData: DashboardData = {
        totalMonthlyCost,
        totalYearlyCost,
        activeSubscriptions: totalActiveSubscriptions,
        numberOfUpcomingRenewals,
        upcomingRenewals,
        categorySpending,
        recentSubscriptions,
        categorywiseSpending: categorySpending,
    };

    // Return the dashboard data as JSON response
    return NextResponse.json(dashboardData, { status: 200 });
}