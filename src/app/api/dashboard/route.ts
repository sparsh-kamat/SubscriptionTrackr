import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateNormalizedMonthlyCost, calculateNormalizedYearlyCost } from "@/lib/subscription-utils";
import { getDaysRemaining } from "@/lib/subscription-utils";
import { type Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { getExchangeRates } from "@/lib/currency";

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
}

export async function GET() {
    // Authenticate the user
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {

        //Step by step, we will fetch the data from the database and perform calculations
        const userId = session.user.id;
        // const fetchedSubscriptions = await prisma.subscription.findMany({
        //     where: { userId },
        //     orderBy: { createdAt: "desc" },
        // });

        const [fetchedSubscriptions, exchangeRates] = await Promise.all([
            prisma.subscription.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
            }),
            getExchangeRates(), // Fetch exchange rates
        ]);

        //if no rates are found, return an error
        if (!exchangeRates) {
            return NextResponse.json({ error: "Failed to fetch exchange rates." }, { status: 500 });
        }

        //filter out subscriptions that are not active
        const activeSubscriptions = fetchedSubscriptions.filter((sub: Subscription) => sub.status?.toLowerCase() === "active");
        //if there are no active subscriptions, return null
        if (activeSubscriptions.length === 0) {
            return NextResponse.json({ message: "No active subscriptions found." }, { status: 200 });
        }


        // Calculate total monthly and yearly costs, active subscriptions, and upcoming renewals
        let totalMonthlyCost = 0;
        let totalYearlyCost = 0;
        const spendingByCategory: { [key: string]: number } = {};

        activeSubscriptions.forEach((sub: Subscription) => {
            const originalCost = sub.cost.toNumber(); // Convert Decimal to number
            // Convert cost to the user's preferred currency if needed
            const convertedCost = originalCost * (exchangeRates[sub.currency] || 1); // Fallback to 1 if rate not found

            totalMonthlyCost += calculateNormalizedMonthlyCost(convertedCost, sub.billingCycle);
            totalYearlyCost += calculateNormalizedYearlyCost(convertedCost, sub.billingCycle);

            if (sub.category) {
                const normalizedCost = calculateNormalizedYearlyCost(convertedCost, sub.billingCycle);
                spendingByCategory[sub.category] = (spendingByCategory[sub.category] || 0) + normalizedCost;
            }
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

        const calculatedRecentSubscriptions = fetchedSubscriptions.slice(0, 5);


        // Calculate category spending
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
            categorySpending : categorySpending,
            recentSubscriptions: calculatedRecentSubscriptions,
        };

        // Return the dashboard data as JSON response
        return NextResponse.json(dashboardData, { status: 200 });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}