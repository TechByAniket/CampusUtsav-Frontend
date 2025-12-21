import { sampleColleges } from "@/services/collegeService";
import type { College } from "@/types/college";
import React from "react";

interface CollegeCardProps {
  collegeId: number;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ collegeId }) => {
  // Find the college by ID
  const college: College | undefined = sampleColleges.find(c => c.id === collegeId);

  if (!college) return null; // if not found, render nothing

  return (
    <div className="border rounded-xl shadow-sm p-4 bg-white flex items-center space-x-4">
      {college.logoUrl && (
        <img
          src={college.logoUrl}
          alt={college.name}
          className="w-14 h-14 object-contain rounded"
        />
      )}
      <div className="flex-1">
        <h3 className="text-md font-semibold">{college.name}</h3>
        <p className="text-sm text-gray-500">{college.city}</p>
        <p className="text-xs text-gray-400">{college.affiliation}</p>
      </div>
    </div>
  );
};
