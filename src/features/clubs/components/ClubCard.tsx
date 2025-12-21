
import type { Club } from '@/types/club'
import React from 'react'

type ClubCardProps = {
    club:Club;
};

export const ClubCard: React.FC<ClubCardProps> = ({ club }) => {
  return (
    <div
      className="
        relative h-[220px] rounded-xl overflow-hidden cursor-pointer
        group hover:scale-105 transition-all duration-300 ease-out
      "
    >
      {/* Background Logo */}
      <img
        src={club.logoUrl}
        alt={club.name}
        className="absolute inset-0 w-full h-full object-contain p-6"
      />

      {/* Gradient Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/85 via-black/45 to-transparent
        "
      />

      {/* Content */}
      <div className="absolute bottom-0 w-full p-4 space-y-1">
        {/* Club Name */}
        <h3 className="text-white font-semibold text-xl leading-none">
          {club.name}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs md:text-sm lg:text-sm text-white/80 leading-none">
          <span className="font-medium">{club.shortForm}</span>
          <span className="opacity-60">•</span>
          <span>{club.adminName}</span>
        </div>
      </div>
    </div>
  );
};
