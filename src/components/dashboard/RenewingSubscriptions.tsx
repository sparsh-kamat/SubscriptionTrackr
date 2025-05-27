import { CalendarClock } from "lucide-react"
// Sample data - in a real app, this would come from your database
const upcomingRenewals = [
  {
    id: "1",
    name: "Netflix",
    amount: 15.99,
    date: "2025-05-28",
    logo: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Spotify",
    amount: 9.99,
    date: "2025-05-30",
    logo: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    amount: 52.99,
    date: "2025-06-02",
    logo: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Adobe Creative Cloud",
    amount: 52.99,
    date: "2025-06-02",
    logo: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Adobe Creative Cloud",
    amount: 52.99,
    date: "2025-06-02",
    logo: "/placeholder.svg",
  },
]
export default function RenewingSubscriptions() {
  return (
    <div >
      {upcomingRenewals.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <CalendarClock className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No upcoming renewals</h3>
          <p className="mt-2 text-sm text-muted-foreground">You don&apos;t have any subscriptions renewing soon.</p>
        </div>
      ) : (
        upcomingRenewals.map((renewal) => (
          <div key={renewal.id} className="flex items-center justify-between  space-y-2">
            <div className="flex items-center gap-4">
              
              <div>
                <h4 className="font-medium overflow-hidden text-ellipsis whitespace-nowrap lg:max-w-[200px] md:max-w-[110px] sm:max-w-[160px] max-w-[140px] ">{renewal.name}</h4>
                <p className="text-sm text-muted-foreground">{new Date(renewal.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">${renewal.amount.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(renewal.date) < new Date()
                  ? "Overdue"
                  : `In ${Math.ceil((new Date(renewal.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
