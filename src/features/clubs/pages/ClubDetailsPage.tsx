import { sampleClubs } from "@/services/clubService";
import { ClubAbout } from "../components/ClubAbout";
import { ClubHero } from "../components/ClubHero";
import { ClubInfoCard } from "../components/ClubInfoCard";
import { ClubSocialLinks } from "../components/ClubSocialLinks";
import { ClubStats } from "../components/ClubStats";
import { useState } from "react";
import type { Club } from "@/types/club";
import { UpcomingEvents } from "../components/UpcomingEvents";
import { sampleEvents } from "@/services/eventService";
import { PastEvents } from "../components/PastEvents";
import { EventCollege } from "@/features/events/components/EventCollege";
import { CollegeCard } from "../components/CollegeCard";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ClubDetailsPage: React.FC = () => {
  const [club, setClub] = useState<Club | null>(sampleClubs[0] || null);
  const [loading, setLoading] = useState(false);

  // Filter upcoming and past events (all events for now)
//   const upcoming = sampleEvents
//     .filter((e) => new Date(e.date) >= new Date())
//     .slice(0, 3);
//   const past = sampleEvents
//     .filter((e) => new Date(e.date) < new Date())
//     .slice(0, 3);

  if (loading) return <p className="px-4 py-10">Loading...</p>;
  if (!club) return <p className="px-4 py-10 text-red-500">Club not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <ClubHero club={club} />

      <ClubStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
        <ClubAbout description={club.description} />

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid grid-cols-2 w-full md:w-1/2 lg:w-1/2 rounded-[8px] bg-black">
                <TabsTrigger value="upcoming" className="rounded-[8px] text-white">
                Upcoming Events
                </TabsTrigger>
                <TabsTrigger value="past" className="rounded-[8px] text-white">
                Past Events
                </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="pt-4">
            <UpcomingEvents events={sampleEvents} />
            </TabsContent>

            <TabsContent value="past" className="pt-4">
            <PastEvents events={sampleEvents} />
            </TabsContent>
        </Tabs>
       </div>

        <div className="space-y-4">
          <ClubInfoCard club={club} />
          {/* <EventCollege /> */}
          <CollegeCard collegeId={club.collegeId} />
          <ClubSocialLinks
            websiteUrl={club.websiteUrl}
            instagramUrl={club.instagramUrl}
            linkedInUrl={club.linkedInUrl}
          />
        </div>
      </div>
    </div>
  );
};