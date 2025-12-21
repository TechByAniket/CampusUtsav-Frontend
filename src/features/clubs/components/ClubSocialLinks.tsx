import { Globe, Instagram, Linkedin } from "lucide-react";

interface ClubSocialLinksProps {
  websiteUrl?: string;
  instagramUrl?: string;
  linkedInUrl?: string;
}

export const ClubSocialLinks: React.FC<ClubSocialLinksProps> = ({
  websiteUrl,
  instagramUrl,
  linkedInUrl,
}) => {
  return (
    <div className="flex items-center justify-center gap-5 pt-3">
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noreferrer"
          title="Website"
          className="
            text-orange-600
            hover:text-orange-700
            transition-all
            hover:scale-110
          "
        >
          <Globe className="w-6 h-6" />
        </a>
      )}

      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          title="Instagram"
          className="
            text-pink-500
            hover:text-pink-600
            transition-all
            hover:scale-110
          "
        >
          <Instagram className="w-6 h-6" />
        </a>
      )}

      {linkedInUrl && (
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          title="LinkedIn"
          className="
            text-blue-600
            hover:text-blue-700
            transition-all
            hover:scale-110
          "
        >
          <Linkedin className="w-6 h-6" />
        </a>
      )}
    </div>
  );
};
