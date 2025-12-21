import type { SocialLinks } from "@/types/event"
import { Instagram, Twitter, Share2 } from "lucide-react"


interface Props {
  socials?: SocialLinks
}

export const EventSocialShare: React.FC<Props> = ({ socials }) => {
  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center justify-between">

        <div className="flex gap-2">
          {socials?.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              className="p-2 border rounded-lg hover:bg-gray-50"
            >
              <Instagram className="w-4 h-4" />
            </a>
          )}

          {socials?.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              className="p-2 border rounded-lg hover:bg-gray-50"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>

        <button
          type="button"
          className="flex items-center gap-2 text-sm border px-3 py-2 rounded-lg hover:bg-gray-50"
          onClick={() => navigator.share?.({ url: window.location.href })}
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

      </div>
    </div>
  )
}
