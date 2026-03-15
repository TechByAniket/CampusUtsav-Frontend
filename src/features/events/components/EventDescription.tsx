import { AlignLeft, Info } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface Props {
  description: string
}

export const EventDescription: React.FC<Props> = ({ description }) => {
  return (
    /* Increased height to h-[600px] to give the content more vertical space */
    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 h-[600px] flex flex-col overflow-hidden">
      
      {/* Header Section */}
      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="text-indigo-600 bg-indigo-50 p-2 rounded-xl shadow-sm border border-indigo-100">
            <AlignLeft className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 leading-none mb-1">
              Deep Dive
            </p>
            <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wider">
              About Event
            </h2>
          </div>
        </div>

        {/* Status Capsule */}
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
            Details
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6 min-h-full transition-colors hover:border-indigo-100 hover:bg-white duration-300">
          <div className="prose prose-sm prose-indigo max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-800">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Bottom Trim */}
      <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end">
        <div className="h-1.5 w-16 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};