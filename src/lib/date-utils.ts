// src/lib/date-utils.ts
import { addMonths, addYears, lastDayOfMonth, setDate, getDate, getMonth } from 'date-fns'; // Use v3 imports

export function calculateNextBillingDate(
  lastBillingDate: Date,
  billingCycle: string
): Date | null {
  if (!lastBillingDate || !(lastBillingDate instanceof Date) || isNaN(lastBillingDate.getTime())) {
    // Handle invalid lastBillingDate if necessary, though Zod should catch it
    return null; 
  }

  const lastBillDay = getDate(lastBillingDate); // Day of the month (1-31)

  switch (billingCycle.toUpperCase()) {
    case "MONTHLY": {
      let nextDate = addMonths(lastBillingDate, 1);
      const nextMonthLastDay = getDate(lastDayOfMonth(nextDate));
      // If the original day was, e.g., 31st, and next month only has 30 days,
      // set to the last day of that next month.
      if (lastBillDay > nextMonthLastDay) {
        nextDate = setDate(nextDate, nextMonthLastDay);
      } else {
        // Otherwise, try to keep the same day of the month.
        // setDate handles month rollovers correctly if lastBillDay is too high for the added month
        // but we want to ensure it doesn't go *beyond* the intended month.
        const tempNextDate = setDate(addMonths(lastBillingDate, 1), lastBillDay);
        if (getMonth(tempNextDate) !== getMonth(addMonths(lastBillingDate,1))) { // rolled over to next month
            nextDate = lastDayOfMonth(addMonths(lastBillingDate,1));
        } else {
            nextDate = tempNextDate;
        }
      }
      return nextDate;
    }
    case "QUARTERLY": {
      let nextDate = addMonths(lastBillingDate, 3);
      const nextQuarterMonthLastDay = getDate(lastDayOfMonth(nextDate));
      if (lastBillDay > nextQuarterMonthLastDay) {
        nextDate = setDate(nextDate, nextQuarterMonthLastDay);
      } else {
        const tempNextDate = setDate(addMonths(lastBillingDate, 3), lastBillDay);
        if (getMonth(tempNextDate) !== getMonth(addMonths(lastBillingDate,3))) {
            nextDate = lastDayOfMonth(addMonths(lastBillingDate,3));
        } else {
            nextDate = tempNextDate;
        }
      }
      return nextDate;
    }
    case "YEARLY":
    case "ANNUALLY": { // Handle variations
      // addYears handles leap years correctly for Feb 29th.
      // If lastBillingDate was Feb 29 and next year is not a leap year, it becomes Feb 28.
      return addYears(lastBillingDate, 1);
    }
    case "ONE-TIME":
      return null; // Or a very distant date if your system requires a date
    default:
      console.warn(`Unknown billing cycle for nextBillingDate calculation: ${billingCycle}`);
      return null; // Or throw an error
  }
}