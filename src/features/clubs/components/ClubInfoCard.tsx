import type { Club } from "@/types/club";

interface ClubInfoCardProps {
  club: Club;
}

export const ClubInfoCard: React.FC<ClubInfoCardProps> = ({ club }) => {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-900">
        Club Information
      </h3>

      <div className="text-sm text-gray-600 space-y-2">
        <p>
          <span className="font-medium">Faculty Coordinator:</span>{" "}
          {club.facultyCoordinatorName}
        </p>
        <p>
          <span className="font-medium">Admin Email:</span>{" "}
          {club.adminEmail}
        </p>
        <p>
          <span className="font-medium">Created On:</span>{" "}
          {new Date(club.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
