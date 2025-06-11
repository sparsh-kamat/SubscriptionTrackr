// src/lib/currency.ts
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache'; // Import the Next.js cache function

interface ExchangeRates {
  [key: string]: number;
}

// 
//  Fetches all exchange rates from the database and caches the result.
//  The cache is set to revalidate every 4 hours. On subsequent calls within this
//  period, the cached data is returned instantly without hitting the database.
//
export const getExchangeRates = unstable_cache(
  async (): Promise<ExchangeRates | null> => {
    console.log("--- Fetching exchange rates from database ---"); // This log will now only appear when the cache is empty or stale

    try {
      const ratesFromDb = await prisma.exchangeRate.findMany();

      if (!ratesFromDb || ratesFromDb.length === 0) {
        console.warn("No exchange rates found in the database. Please run the seed/update script.");
        return {}; 
      }

      // Convert the array of records into a key-value object
      const ratesObject = ratesFromDb.reduce((acc, rateEntry) => {
        acc[rateEntry.currencyCode] = rateEntry.rate.toNumber();
        return acc;
      }, {} as ExchangeRates);
      
      return ratesObject;
    } catch (error) {
      console.error("Error fetching rates from local database:", error);
      return null;
    }
  },
  ['exchange-rates'], // A unique key for this specific cache. Can be anything.
  {
    // Options object
    revalidate: 4 * 60 * 60, // Cache lifetime in seconds (e.g., 4 hours)
    tags: ['rates'], // Optional: tags for on-demand revalidation if needed later
  }
);
