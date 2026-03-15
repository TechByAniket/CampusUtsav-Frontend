import type { Club } from "@/types/club";

// interface ClubHeroProps {
//   club: Club;
// }

export const ClubHero = ({ club }) => {
  return (
    <div className="relative h-[260px] rounded-2xl overflow-hidden">
      <img
        src={club.logoUrl}
        alt={club.name}
        className="absolute inset-0 w-full h-full object-contain p-10"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      <div className="absolute bottom-0 w-full p-6 space-y-1">
        <h1 className="text-white text-2xl font-semibold">
          {club.name}
        </h1>
        <p className="text-sm text-white/80">
          {club.shortForm} • Pillai College of Engineering
        </p>
      </div>
    </div>
  );
};
