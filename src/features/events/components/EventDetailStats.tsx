import { 
  Clock, MapPin, 
  CreditCard, Users2, 
  UserCircle2, CalendarDays
} from 'lucide-react';

interface StatTileProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}

const StatTile = ({ icon: Icon, label, value, color = "indigo" }: StatTileProps) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-200/60 hover:border-slate-300 hover:shadow-md transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-500 group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1.5">{label}</p>
        <p className="text-sm font-bold text-slate-900 leading-none">{value}</p>
      </div>
    </div>
  </div>
);

interface EventDetailStatsProps {
  startTime: string;
  endTime: string;
  venue: string;
  fees: number;
  teamEvent: boolean;
  minTeamSize?: number;
  maxTeamSize?: number;
  maxParticipants: number;
  registrationDeadline: string;
}

export const EventDetailStats = ({
  startTime,
  endTime,
  venue,
  fees,
  teamEvent,
  minTeamSize = 1,
  maxTeamSize = 1,
  maxParticipants,
  registrationDeadline
}: EventDetailStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
      <StatTile 
        icon={Clock} 
        label="Event Window" 
        value={`${startTime?.slice(0, 5)} - ${endTime?.slice(0, 5)}`} 
      />
      
      <StatTile 
        icon={CalendarDays} 
        label="Reg. Deadline" 
        value={registrationDeadline} 
        color="rose"
      />

      <StatTile 
        icon={CreditCard} 
        label="Entry Fee" 
        value={fees === 0 ? "Free Entry" : `₹${fees}`} 
        color="emerald"
      />

      <StatTile 
        icon={teamEvent ? Users2 : UserCircle2} 
        label="Participation" 
        value={teamEvent ? (minTeamSize === maxTeamSize ? `Team of ${minTeamSize}` : `Team (${minTeamSize}-${maxTeamSize})`) : "Individual"} 
        color="amber"
      />

      <StatTile 
        icon={MapPin} 
        label="Location" 
        value={venue} 
        color="slate"
      />

      <StatTile 
        icon={Users2} 
        label="Capacity" 
        value={`${maxParticipants} Spots`} 
        color="blue"
      />
    </div>
  );
};
