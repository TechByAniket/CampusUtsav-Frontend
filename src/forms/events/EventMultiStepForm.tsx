import { useEventMultiStepForm } from "@/hooks/useEventMultiStepForm";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, BadgeInfo, Calendar, Users, Image, Phone } from "lucide-react";
import { EventBasicForm } from "./components/EventBasicForm";
import { EventScheduleForm } from "./components/EventScheduleForm";
import { EventRegistrationForm } from "./new-components/EventRegistrationForm";
import { EventTeamForm } from "./components/EventTeamForms";
import { EventMediaForm } from "./components/EventMediaForm";
import { EventMetaForm } from "./components/EventMetaForm";
import { createEvent } from "@/services/eventService";
import { toast } from "sonner";
import { EventDescription } from "@/features/events/components/EventDescription";
import { EventDescriptionForm } from "./components/EventDescriptionForm";

// Import your step components

export const eventSteps = [
  { id: "basic", name: "Event Details", description: "Basic info", icon: BadgeInfo, component: EventBasicForm },
  { id: "description", name: "Event Description", description: "Event details", icon: BadgeInfo, component: EventDescriptionForm },  
  { id: "schedule", name: "Schedule", description: "Date, time & venue", icon: Calendar, component: EventScheduleForm },
  { id: "registration", name: "Registration", description: "Fees & participants", icon: Users, component: EventRegistrationForm },
  { id: "team", name: "Team Settings", description: "Individual or team event", icon: Users, component: EventTeamForm },
  { id: "media", name: "Media", description: "Poster & attachments", icon: Image, component: EventMediaForm },
  { id: "meta", name: "Contact & Visibility", description: "Contact details & status", icon: Phone, component: EventMetaForm },
];

export const EventMultiStepForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    currentStep,
    steps,
    formData,
    goToNextStep,
    goToPreviousStep,
    updateForm,
    submitForm,
    isLastStep,
  } = useEventMultiStepForm({
    steps: eventSteps,
    initialValues: {
  title: "",
  description: "",
  eventCategory: "",
  eventType: "",
  date: "",
  startTime: "",
  endTime: "",
  venue: "",
  fees: 0,
  // maxParticipants: 1,
  teamEvent: false,
  teamSize: 1,
  attachments: [],
  poster: null,
  registrationLink: "",
  registrationDeadline: "",
  contactDetails: {
    person1: { name: "", contact: "" },
    person2: { name: "", contact: "" }, 
  },
  // status: "draft",
  // is_active: true,
  // is_featured: false,
  
  // <-- add nested extraInfo
  // extraInfo: {
  //   contactInfo: {
  //     person1: { name: "", contact: "", email: "" },
  //     person2: { name: "", contact: "", email: "" },
  //   }
  // },
},

    onSubmit: async (data) => {
  try {
    const formData = new FormData();

    // ✅ sanitize attachments (links)
    const sanitizedAttachments =
      data.attachments?.filter(
        (link) => link && link !== "None"
      ) || [];

    const { poster, ...rest } = data;

    const eventData = {
      ...rest,
      attachments: sanitizedAttachments, // ✅ KEEP attachments
    };

    // ✅ JSON part
    formData.append(
      "event",
      new Blob([JSON.stringify(eventData)], {
        type: "application/json",
      })
    );

    // ✅ file part (NAME MUST MATCH BACKEND)
    if (poster) {
      formData.append("file", poster);
    }

    // 🔥 API CALL
    const clubId = Number(localStorage.getItem("clubId") || 1021);
    await createEvent(formData, clubId);

    toast.success("Event created successfully");
    onClose();

  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Failed to create event"
    );
  }
}
  });

  const StepComponent = steps[currentStep].component;
  const StepIcon = steps[currentStep].icon;
  const stepName = steps[currentStep].name;
  const stepDescription = steps[currentStep].description;

  const totalSteps = steps.length;
  const current = currentStep + 1;
  const percentage = Math.round((current / totalSteps) * 100);

  console.log("FORM DATA 👉", formData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto max-h-[90vh] flex flex-col">
  {/* HEADER */}
  <div className="space-y-4">
    <Progress value={percentage} className="w-full" />
    <p className="text-sm text-center text-muted-foreground">
      Step {current} of {totalSteps}
    </p>

    <div className="flex items-center gap-4">
      <span className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
        <StepIcon className="h-6 w-6" />
      </span>
      <div>
        <h2 className="text-xl font-bold">{stepName}</h2>
        <p className="text-sm text-gray-500">{stepDescription}</p>
      </div>
    </div>
  </div>

  {/* STEP FORM */}
  <div className="flex-1 overflow-y-auto mt-4">
    <StepComponent
      defaultValues={formData}
      updateForm={updateForm}
      goNext={goToNextStep}
      submitForm={submitForm}
      isLastStep={isLastStep}
    />
  </div>

  {/* NAVIGATION */}
  <div className="flex justify-between mt-4">
    <Button onClick={goToPreviousStep} disabled={currentStep === 0}>
      <ChevronLeft /> Previous
    </Button>
    <Button type="submit" form="step-form">
      {isLastStep ? "Submit" : "Next"}
    <ChevronRight />
  </Button>
  </div>
</div>

  );
};
