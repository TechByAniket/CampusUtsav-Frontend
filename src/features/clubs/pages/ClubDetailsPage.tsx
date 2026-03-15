import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { getClubById, sampleClubs } from "@/services/clubService";
import { sampleEvents } from "@/services/eventService";

import { ClubAbout } from "../components/ClubAbout";
import { ClubHero } from "../components/ClubHero";
import { ClubInfoCard } from "../components/ClubInfoCard";
import { ClubSocialLinks } from "../components/ClubSocialLinks";
import { ClubStats } from "../components/ClubStats";
import { UpcomingEvents } from "../components/UpcomingEvents";
import { PastEvents } from "../components/PastEvents";
import { CollegeCard } from "../components/CollegeCard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ClubDetailsPage = () => {
  const { clubId } = useParams();
  console.log("Club ID from params:", clubId);
  const collegeId = useSelector((state) => state.auth.collegeId);

  // const [club, setClub] = useState(null);
  const [club, setClub] = useState(sampleClubs[0] || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collegeId || !clubId) return;

    const fetchClub = async () => {
      setLoading(true);
      const data = await getClubById(collegeId, Number(clubId));
      console.log("Fetched club data:", data);
      setClub(data);
      setLoading(false);
    };

    fetchClub();
  }, [collegeId, clubId]);

  if (loading) return <p className="px-4 py-10">Loading club...</p>;
  if (!club) return <p className="px-4 py-10 text-red-500">Club not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <ClubHero club={club} />
      <ClubStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <ClubAbout description={club.description} />

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid grid-cols-2 w-full md:w-1/2 rounded-[8px] bg-black">
              <TabsTrigger value="upcoming" className="text-white">
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger value="past" className="text-white">
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

        {/* RIGHT */}
        <div className="space-y-4">
          <ClubInfoCard club={club} />
          {club.college?.id && <CollegeCard collegeId={club.college.id} />}
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
