import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // Your shared Prisma client
import { auth } from  "@/lib/auth"
import { subscriptionSchema } from "@/lib/validations/subscription";
import { calculateNextBillingDate } from "@/lib/date-utils";


export async function POST(request: NextRequest) {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const validation = subscriptionSchema.safeParse(body)
        if (!validation.success) {
            console.error(
                "Validation error in subscription:",
                validation.error.flatten().fieldErrors
            )
            return NextResponse.json(
                { errors: validation.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const {
            name,
            cost,
            currency,
            billingCycle,
            lastBillingDate,
            status,
            category,
            folder,
            notes,
        } = validation.data

        // Calculate next billing date based on the last billing date and billing cycle
        const nextBillingDate = calculateNextBillingDate(
            new Date(lastBillingDate),
            billingCycle
        );
        console.log("Next Billing Date:", nextBillingDate);

        const newSubscription = await prisma.subscription.create({// lowercase 's'
            data: {
                name,
                cost,
                currency,
                billingCycle,
                lastBillingDate,
                nextBillingDate,
                status,
                category,
                folder,
                notes,
                userId: session.user.id,
            },
        });

        return NextResponse.json(newSubscription, { status: 201 }); // Return after success

    } catch (error) {
        // ... your catch block
        console.error("Error creating subscription:", error)
        return NextResponse.json(
            { error: "Error creating subscription" },
            { status: 500 }
        );

    }

}

export async function GET() {
    const session = await auth()
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                nextBillingDate: 'asc',
            },
        });

        return NextResponse.json(subscriptions, { status: 200 });
    } catch (error) {
        console.error("Error fetching subscriptions:", error)
        return NextResponse.json(
            { error: "Error fetching subscriptions" },
            { status: 500 }
        );
    }
}