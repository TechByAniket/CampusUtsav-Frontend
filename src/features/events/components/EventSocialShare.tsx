import type { SocialLinks } from "@/types/event"
import { Instagram, Twitter, Share2, Copy, Check } from "lucide-react"
import { useState } from "react";


interface Props {
  socials?: SocialLinks
}

export const EventSocialShare: React.FC<Props> = ({ socials }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header Section */}
      <div className="px-5 py-3 border-b border-gray-50 bg-white flex items-center gap-3">
        <div className="text-indigo-600 bg-indigo-50 p-1.5 rounded-lg border border-indigo-100">
          <Share2 className="w-4 h-4" />
        </div>
        <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest leading-none">
          Spread the Word
        </h2>
      </div>

      {/* Content Area */}
      <div className="p-4 bg-white flex items-center justify-between gap-4">
        
        {/* Social Icons Group */}
        <div className="flex items-center gap-2">
          {socials?.instagram && (
            <a
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all"
              title="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {socials?.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all"
              title="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Action Button - Switch to Copy to avoid the Windows "Stuck" bug */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-md ${
            copied 
              ? "bg-emerald-500 text-white shadow-emerald-100" 
              : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Footer Trim */}
      <div className="px-6 py-2 bg-gray-50/30 flex justify-center">
        <div className="h-1 w-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};