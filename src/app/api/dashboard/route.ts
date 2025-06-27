import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { calculateNormalizedMonthlyCost, calculateNormalizedYearlyCost } from "@/lib/subscription-utils";
import { getDaysRemaining } from "@/lib/subscription-utils";
import { type Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import { getExchangeRates } from "@/lib/currency";
import { startOfMonth } from "date-fns";

interface UpcomingRenewal extends Subscription {
    daysUntilRenewal: number | null; // Days until the next billing date, null if not applicable
}

interface CategorySpending {
    name: string;
    value: number;
}

export interface DashboardData {
    totalMonthlyCost: number;
    totalYearlyCost: number;
    activeSubscriptions: number;
    numberOfUpcomingRenewals: number;
    upcomingRenewals: UpcomingRenewal[];
    categorySpending: CategorySpending[];
    recentSubscriptions: Subscription[];
    // Total Monthly Cost ,Active Subscriptions, Annual Spending, Upcoming Renewals is top cards
    topCards: {
        totalMonthlyCost: number;
        monthlyCostChange: number; // This can be calculated if needed
        activeSubscriptions: number;
        activeSubscriptionsChange: number; // This can be calculated if needed
        totalYearlyCost: number;
        numberOfUpcomingRenewals: number;

    };
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


        //current date/time 
        const now_server = new Date();
        const startOfCurrentMonth = startOfMonth(now_server);
        const fifteenDaysFromNow = new Date(now_server.getTime() + 15 * 24 * 60 * 60 * 1000);


        //filter out subscriptions that are not active
        const activeSubscriptions = fetchedSubscriptions.filter((sub: Subscription) => sub.status?.toLowerCase() === "active");
        //if there are no active subscriptions, return null
        if (activeSubscriptions.length === 0) {
            return NextResponse.json({ message: "No active subscriptions found." }, { status: 200 });
        }

        const activeSubsLastMonth = activeSubscriptions.filter((sub: Subscription) => new Date(sub.createdAt) < startOfCurrentMonth);


        // Calculate total monthly and yearly costs, active subscriptions, and upcoming renewals
        let totalMonthlyCost = 0;
        let totalMonthlyCostChange = 0; // This can be calculated if needed
        let totalYearlyCost = 0;
        let activeSubscriptionsChange = activeSubscriptions.length - activeSubsLastMonth.length; // Change in active subscriptions compared to last month

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

        // Calculate total monthly cost change
        if (activeSubsLastMonth.length > 0) {
            const lastMonthTotal = activeSubsLastMonth.reduce((acc, sub) => {
                const originalCost = sub.cost.toNumber();
                const convertedCost = originalCost * (exchangeRates[sub.currency] || 1);
                return acc + calculateNormalizedMonthlyCost(convertedCost, sub.billingCycle);
            }, 0);
            totalMonthlyCostChange = totalMonthlyCost - lastMonthTotal;
        }
        else {
            totalMonthlyCostChange = totalMonthlyCost; // If no previous subscriptions, change is equal to current
        }

        //total active subscriptions
        const totalActiveSubscriptions = activeSubscriptions.length;

        // Get upcoming renewals

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
            categorySpending: categorySpending,
            recentSubscriptions: calculatedRecentSubscriptions,
            topCards: {
                totalMonthlyCost,
                activeSubscriptions: totalActiveSubscriptions,
                monthlyCostChange: totalMonthlyCostChange, // Format to 2 decimal places
                activeSubscriptionsChange: activeSubscriptionsChange,
                totalYearlyCost,
                numberOfUpcomingRenewals,
            },
        };

        // Return the dashboard data as JSON response
        return NextResponse.json(dashboardData, { status: 200 });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}