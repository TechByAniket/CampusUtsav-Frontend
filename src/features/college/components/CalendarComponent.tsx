import * as React from "react"
import { formatDateRange } from "little-date"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

const events = [
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
  {
    title: "Team Sync Meeting",
    from: "2025-06-12T09:00:00",
    to: "2025-06-12T10:00:00",
  },
]

export const CalendarComponent = () => {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2025, 5, 12)
  )

  return (
   <Card className="w-full h-full flex flex-col  rounded-lg">
  {/* Calendar Section */}
  <CardContent 
    /* The h-[50%] remains to constrain the container height. */
    className="w-full h-[55%] px-1 flex justify-center items-start rounded-[8px] overflow-y-auto overflow-hidden"
  >
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      /* CRITICAL FIX: Set a fixed minimum height (e.g., min-h-[280px]) 
         on the calendar itself. This ensures the calendar takes up the 
         same vertical space whether it has 5 or 6 rows of days, 
         stabilizing the entire Card height.
      */
      className=" w-full h-[420px] sm:h-[450px] md:h-[440px] lg:h-[440px]"
      required
    />
  </CardContent>

  {/* Footer / Events Section */}
  <CardFooter 
    /* This section remains flex-1 to take the remaining height. */
    className="h-[45%] w-full flex-1 flex flex-col gap-3 border-t px-4"
  >
    
    {/* Selected Date + Add Event */}
    <div className="flex w-full items-center justify-between px-1">
      <div className="text-lg font-bold">
        {date?.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
      <ScrollableEventList events={events} formatDateRange={formatDateRange} />
  </CardFooter>
</Card>




  )
}


interface ScrollableEventListProps {
  events: {
    title: string;
    from: string;
    to: string;
  }[];
  formatDateRange: (from: Date, to: Date) => string;
}

const ScrollableEventList: React.FC<ScrollableEventListProps> = ({
  events,
  formatDateRange,
}) => {
  return (
    <div className="w-full h-72 flex flex-col gap-2 overflow-y-auto overflow-hidden">
      {events.map((event) => (
        <div
          key={event.title}
          className="bg-foreground relative rounded-[8px] p-2 pl-6 text-sm 
          after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full after:bg-primary"
        >
          <div className="font-semibold text-white">{event.title}</div>
          <div className="text-muted-foreground text-xs">
            {formatDateRange(new Date(event.from), new Date(event.to))}
          </div>
        </div>
      ))}
    </div>
  );
};
