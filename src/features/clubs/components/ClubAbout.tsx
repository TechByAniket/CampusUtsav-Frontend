interface ClubAboutProps {
  description: string;
}

export const ClubAbout: React.FC<ClubAboutProps> = ({ description }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">
        About the Club
      </h2>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
