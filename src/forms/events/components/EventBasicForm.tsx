import { CustomFormField } from "@/forms/components/CustomFormField";
import { fetchEventMetaData } from "@/services/eventService";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type EventBasicFormData = {
  title: string;
  // description: string;
  eventCategory: string;
  eventType: string;
};

type Props = {
  defaultValues: Partial<EventBasicFormData>;
  updateForm: (data: Partial<EventBasicFormData>) => void;
  goNext: () => void;
};


export const EventBasicForm: React.FC<Props> = ({
  defaultValues,
  updateForm,
  goNext,
}) => {
  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue
  } = useForm<EventBasicFormData>({
    defaultValues,
  });

  const [eventMeta, setEventMeta] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // fetch metadata
  useEffect(() => {
    const loadEventMeta = async () => {
      try {
        setLoading(true);
        const response = await fetchEventMetaData();
        setEventMeta(response);
      } catch (error) {
        toast.error("Failed to load event metadata");
      } finally {
        setLoading(false);
      }
    };
    loadEventMeta();
  }, []);

  // reset type if category changes
  const selectedCategory = watch("eventCategory");
  useEffect(() => {
    setValue("eventType", "");
  }, [selectedCategory, setValue]);

  const onSubmit = (data: EventBasicFormData) => {
    updateForm(data);
    goNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Event Title */}
      <CustomFormField<EventBasicFormData>
        label="Event Title"
        name="title"
        register={register}
        error={formState.errors.title}
        type="input"
        registerOptions={{ required: "Event title is required" }}
        inputProps={{ placeholder: "Enter event title" }}
      />

      {/* Description */}
      {/* <CustomFormField<EventBasicFormData>
        label="Description"
        name="description"
        register={register}
        error={formState.errors.description}
        type="textarea"
        registerOptions={{ required: "Description is required" }}
        textareaProps={{ placeholder: "Describe the event", rows: 4 }}
      /> */}

      {/* Event Category */}
      <CustomFormField<EventBasicFormData>
        label="Event Category"
        name="eventCategory"
        register={register}
        error={formState.errors.eventCategory}
        type="select"
        registerOptions={{ required: "Please select event category" }}
        disabled={loading}
      >
        <option value="">Select category</option>
        {Object.keys(eventMeta)
          .sort()
          .map((category) => (
            <option key={category} value={category}>
              {category.replace("_", " ")}
            </option>
          ))}
      </CustomFormField>

      {/* Event Type */}
      <CustomFormField<EventBasicFormData>
        label="Event Type"
        name="eventType"
        register={register}
        error={formState.errors.eventType}
        type="select"
        registerOptions={{ required: "Please select event type" }}
        disabled={loading || !selectedCategory}
      >
        <option value="">Select event type</option>
        {selectedCategory &&
          eventMeta[selectedCategory]
            ?.sort()
            .map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ")}
              </option>
            ))}
      </CustomFormField>
    </form>
  );
};
