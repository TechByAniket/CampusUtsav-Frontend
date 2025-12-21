import { Input } from "@/components/ui/input";
import { ClubCard } from "@/features/clubs/components/ClubCard";
import { sampleClubs } from "@/services/clubService";
import React from "react";
import { Link } from "react-router-dom";

export const Clubs: React.FC = () => {
  return (
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

        {/* Search Bar & Filters  */}
        <div className="p-2 grid grid-cols-1 lg:grid-cols-2 gap-2 mb-10">
            <div className="flex gap-2 items-center">
              <Input 
                placeholder='Search for Student Chapters, Clubs & Societies' 
                className='w-full px-4 text-xs md:text-sm lg:text-sm'
                />
              {/* <Search/> */}
            </div>
            <div className="bg-amber-300">Filters</div>
        </div> 

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleClubs.map((club) => (
            <Link to={`/college-dashboard/clubs/${club.id}`}>
                <ClubCard key={club.id} club={club} />
            </Link>
        ))}
      </div>
        


        <div className='text-center'>
          Pagination 
        </div>

    </section>
  );
};
