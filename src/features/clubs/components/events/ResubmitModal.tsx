import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { OnePageCreateEventForm } from '@/features/events/components/CreateEventForm';

import type { Event } from '@/types/event';

interface ResubmitModalProps {
  event: Event;
  onClose: () => void;
}

export const ResubmitModal: React.FC<ResubmitModalProps> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto no-scrollbar">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl relative overflow-hidden border border-slate-200 my-auto"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic">Resubmit Proposal • #{event.id}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto no-scrollbar">
          <OnePageCreateEventForm
            initialData={event as any}
            isModal={true}
            onClose={() => {
              onClose();
              window.location.reload();
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
