export const ClubStats = () => {
  return (
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xl font-semibold text-gray-900">12</p>
        <p className="text-xs text-gray-500">Events</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xl font-semibold text-gray-900">240+</p>
        <p className="text-xs text-gray-500">Members</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xl font-semibold text-gray-900">5</p>
        <p className="text-xs text-gray-500">Years Active</p>
      </div>
    </div>
  );
};
