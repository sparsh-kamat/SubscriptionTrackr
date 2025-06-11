import { NextResponse } from "next/server";
import { updateDatabaseRates } from "@/scripts/update-rates";


export async function GET(req: Request) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await updateDatabaseRates();
        return NextResponse.json({ message: 'Exchange rates updated successfully' }, { status: 200 });
    }
    catch (error) {
        console.error("Error updating exchange rates:", error);
        return NextResponse.json({ error: 'Failed to update exchange rates' }, { status: 500 });
    }


}