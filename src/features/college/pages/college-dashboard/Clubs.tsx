import { Input } from "@/components/ui/input";
import { ClubCard } from "@/features/clubs/components/ClubCard";
import { sampleClubs, getClubsByCollege } from "@/services/clubService";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const Clubs = () => {
  const [clubs, setClubs] = useState(sampleClubs);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const collegeId = useSelector((state) => state.auth.collegeId);

  useEffect(() => {
    if (!collegeId) return;

    const fetchClubs = async () => {
      setLoading(true);
      try {
        const data = await getClubsByCollege();
        setClubs(Array.isArray(data) ? data : sampleClubs);
      } catch {
        setClubs(sampleClubs);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [collegeId]);

  /* =======================
     Search filter
  ======================= */

  const filteredClubs = useMemo(() => {
    if (!search.trim()) return clubs;

    const q = search.toLowerCase();
    return clubs.filter(
      (club) =>
        club.name?.toLowerCase().includes(q) ||
        club.shortForm?.toLowerCase().includes(q) ||
        club.adminName?.toLowerCase().includes(q)
    );
  }, [clubs, search]);

  return (
    <section className="mx-auto p-2 min-h-screen w-full bg-gray-100 rounded-[8px]">

      {/* Search */}
      <div className="mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clubs, councils, societies…"
          className="w-full text-sm"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[220px] rounded-xl bg-gray-300 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredClubs.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No clubs found
        </div>
      )}

      {/* Clubs Grid */}
      {!loading && filteredClubs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredClubs.map((club) => (
            <Link key={club.id} to={`/college-dashboard/clubs/${club.id}`}>
              <ClubCard club={club} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
