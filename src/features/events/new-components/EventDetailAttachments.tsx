import { 
  Lock, 
  ShieldAlert
} from 'lucide-react';
import { FileCard } from '@/components/common/FileCard';

interface EventDetailAttachmentsProps {
  publicAttachments: Record<string, string>;
  privateAttachments: Record<string, string>;
  isBento?: boolean;
}

export const EventDetailAttachments = ({
  publicAttachments,
  privateAttachments,
  isBento = false
}: EventDetailAttachmentsProps) => {
  const publicList = Object.entries(publicAttachments || {});
  const privateList = Object.entries(privateAttachments || {});
  const total = publicList.length + privateList.length;

  const content = (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
         <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1.5">Event Resources</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Event Resources</p>
         </div>
         <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black text-sm shadow-md">
            {total}
         </div>
      </div>

      {/* Optimizing for Sidebar (1-column stack) */}
      <div className="flex flex-col gap-4">
        {publicList.map(([name, url]) => (
          <FileCard key={name} url={url} label={name} />
        ))}
        {privateList.map(([name, url]) => (
          <div key={name} className="relative group">
             <FileCard url={url} label={name} />
             <div className="absolute top-2 right-12 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-2 py-1 bg-rose-50 text-rose-500 border border-rose-100 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                   <Lock size={10} />
                   <span>Access Restricted</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {total === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-300 font-bold text-xs uppercase tracking-widest flex flex-col items-center gap-3">
            <ShieldAlert size={20} className="text-slate-200" />
            No assets linked
          </div>
      )}
    </div>
  );

  if (isBento) {
    return (
      <div className="p-5 bg-[#f8fafc]/50 rounded-3xl border border-slate-200 shadow-md h-full">
        {content}
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-md">
      {content}
    </div>
  );
};
