import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Edit3 as Edit3Icon } from 'lucide-react';
import { getEventApprovalHistory } from '@/services/eventService';
import { ApprovalChain } from './ApprovalChain';

import type { EventSummary } from '@/types/event';

interface SubmissionModalProps {
  event: EventSummary;
  onClose: () => void;
  onEdit: () => void;
}

import type { ApprovalLog } from '@/types/approval';

export const SubmissionModal: React.FC<SubmissionModalProps> = ({ event, onClose, onEdit }) => {
  const [history, setHistory] = useState<ApprovalLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getEventApprovalHistory(event.id);
        setHistory(data || []);
        if (data && data.length > 0) {
          const maxVersion = Math.max(...data.map((h: ApprovalLog) => h.version));
          setSelectedVersion(maxVersion);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    fetchHistory();
  }, [event.id]);

  const versions = useMemo(() => {
    const vMap: Record<number, any[]> = {};
    history.forEach(h => {
      if (!vMap[h.version]) vMap[h.version] = [];
      vMap[h.version].push(h);
    });
    return vMap;
  }, [history]);

  const sortedVersions = Object.keys(versions).map(Number).sort((a, b) => b - a);
  const currentHistory = selectedVersion ? versions[selectedVersion] : [];

  const isReverted = event.status === 'REVERTED';
  const isApproved = event.status === 'APPROVED';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-slate-200"
      >
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src={event.posterUrl} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900 uppercase truncate leading-tight">{event.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded-lg">ID #{event.id}</span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : isReverted ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {event.status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="ml-auto p-2 text-slate-300 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>

        <div className="p-8 max-h-[500px] overflow-y-auto no-scrollbar">
          {!isLoading && sortedVersions.length > 1 && (
            <div className="flex items-center gap-2 mb-10 overflow-x-auto no-scrollbar">
              {sortedVersions.map(v => (
                <button
                  key={v}
                  onClick={() => setSelectedVersion(v)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedVersion === v ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}
                >
                  v{v}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Logs...</p>
            </div>
          ) : (
            <ApprovalChain
              history={currentHistory}
              isFinalApproved={isApproved && selectedVersion === Math.max(...sortedVersions)}
              currentStatus={event.status}
            />
          )}

          <div className="mt-12 flex items-center gap-4">
            <button onClick={onClose} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-100 active:scale-95">Dismiss</button>
            {isReverted && selectedVersion === Math.max(...sortedVersions) && (
              <button
                onClick={onEdit}
                className="flex-2 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 px-8"
              >
                <Edit3Icon size={16} /> Resubmit
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
