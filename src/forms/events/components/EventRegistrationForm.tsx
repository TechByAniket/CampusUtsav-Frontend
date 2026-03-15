import { CustomFormField } from "@/forms/components/CustomFormField";
import { useForm } from "react-hook-form";

type EventRegistrationFormData = {
  fees: number;
  maxParticipants: number;
  registrationLink: string;
};

type Props = {
  defaultValues: Partial<EventRegistrationFormData>;
  updateForm: (data: Partial<EventRegistrationFormData>) => void;
  goNext: () => void;
};

export const EventRegistrationForm: React.FC<Props> = ({
  defaultValues,
  updateForm,
  goNext,
}) => {
  const { register, handleSubmit, formState } =
    useForm<EventRegistrationFormData>({
      defaultValues,
    });

  const onSubmit = (data: EventRegistrationFormData) => {
    updateForm(data); // numbers already parsed
    goNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Fees */}
      <CustomFormField<EventRegistrationFormData>
        label="Registration Fees (₹)"
        name="fees"
        register={register}
        registerOptions={{ valueAsNumber: true, min: 0 }}
        error={formState.errors.fees}
        type="input"
        inputProps={{ type: "number", min: 0 }}
      />

      {/* Max Participants */}
      {/* <CustomFormField<EventRegistrationFormData>
        label="Max Participants"
        name="max_participants"
        register={register}
        registerOptions={{ valueAsNumber: true, min: 1 }}
        error={formState.errors.max_participants}
        type="input"
        inputProps={{ type: "number", min: 1 }}
      /> */}

      {/* Registration Link */}
      <CustomFormField<EventRegistrationFormData>
        label="Registration Link"
        name="registrationLink"
        register={register}
        error={formState.errors.registrationLink}
        type="input"
        inputProps={{ placeholder: "https://forms.google.com/..." }}
      />
    </form>
  );
};
