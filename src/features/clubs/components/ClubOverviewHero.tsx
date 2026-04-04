import { Button } from "@/components/ui/button";
import { EventMultiStepForm } from "@/forms/events/EventMultiStepForm";
import { OnePageCreateEventForm } from "@/forms/events/OnePageCreateEventForm";
import React, { useState } from "react";

export const ClubOverviewHero: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

  return (
    <div
      className="
    w-full mb-8 rounded-2xl
    bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400
    relative overflow-hidden
  "
    >
      {/* Overlay (future image friendly) */}
      <div className="absolute inset-0 bg-black/10" />

      <div
        className="
      relative z-10 px-6 py-10 md:px-10 md:py-14
      flex flex-col md:flex-row items-start md:items-center
      justify-between gap-6
    "
      >
        {/* Left Content */}
        <div className="max-w-xl text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Create & Manage Your Club Events
          </h2>
          <p className="mt-2 text-white/90 text-sm md:text-base">
            Publish events, track approvals, and engage students — all from one
            place.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <Button
            className="
          px-6 py-3 rounded-xl font-semibold
          bg-black text-white hover:bg-neutral-800
          transition
        "
            onClick={openModal}
          >
            + Create Event
          </Button>

          {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-6">
  <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative">
    {/* Close button */}
    <button
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold"
      onClick={closeModal}
    >
      ×
    </button>

    {/* Multi-step form */}
    <div className="flex-1 overflow-y-auto">
      {/* <EventMultiStepForm /> */}
      <OnePageCreateEventForm/>
    </div>
  </div>
</div>

      )}

          <Button
            className="
          px-6 py-3 rounded-xl font-semibold
          bg-white text-black hover:bg-neutral-100
          transition
        "
          >
            View Events
          </Button>
        </div>
      </div>
    </div>
  );
};
