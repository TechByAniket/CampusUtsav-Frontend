import { CustomFormField } from "@/forms/components/CustomFormField";
import { useForm } from "react-hook-form";

type EventScheduleFormValues = {
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
};

type Props = {
  defaultValues: Partial<EventScheduleFormValues>;
  updateForm: (data: Partial<EventScheduleFormValues>) => void;
  goNext: () => void;
};

export const EventScheduleForm: React.FC<Props> = ({
  defaultValues,
  updateForm,
  goNext,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventScheduleFormValues>({
    defaultValues,
  });

  const onSubmit = (data: EventScheduleFormValues) => {
    updateForm(data);
    goNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <CustomFormField
        label="Event Date"
        name="date"
        register={register}
        error={errors.date}
        type="input"
        inputProps={{ type: "date" }}
      />

      <CustomFormField
        label="Start Time"
        name="startTime"
        register={register}
        error={errors.startTime}
        type="input"
        inputProps={{ type: "time" }}
      />

      <CustomFormField
        label="End Time"
        name="endTime"
        register={register}
        error={errors.endTime}
        type="input"
        inputProps={{ type: "time" }}
      />

      <CustomFormField
        label="Registration Deadline"
        name="registrationDeadline"
        register={register}
        error={errors.registrationDeadline}
        type="input"
        inputProps={{ type: "date" }}
      />
      
      <CustomFormField
        label="Venue"
        name="venue"
        register={register}
        error={errors.venue}
        type="input"
        inputProps={{ placeholder: "Auditorium / Hall / Online" }}
      />
    </form>
  );
};
