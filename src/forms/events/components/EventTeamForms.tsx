import { CustomFormField } from "@/forms/components/CustomFormField";
import { useForm } from "react-hook-form";

type EventTeamFormValues = {
  teamEvent: boolean;
  teamSize?: number;
};

type Props = {
  defaultValues: Partial<EventTeamFormValues>;
  updateForm: (data: Partial<EventTeamFormValues>) => void;
  goNext: () => void;
};

export const EventTeamForm: React.FC<Props> = ({
  defaultValues,
  updateForm,
  goNext,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EventTeamFormValues>({
    defaultValues,
  });

  const teamEvent = watch("teamEvent");

  const onSubmit = (data: EventTeamFormValues) => {
    updateForm(teamEvent ? data : { teamEvent: false });
    goNext();
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Team Event Checkbox */}
      <CustomFormField<EventTeamFormValues>
        label="Team Event"
        name="teamEvent"
        register={register}
        type="input"
        inputProps={{ type: "checkbox" }}
      />

      {/* Team Size (only if team event) */}
      {teamEvent && (
        <CustomFormField<EventTeamFormValues>
          label="Team Size"
          name="teamSize"
          register={register}
          registerOptions={{ valueAsNumber: true, min: 1 }}
          error={errors.teamSize}
          type="input"
          inputProps={{ type: "number", min: 1 }}
        />
      )}
    </form>
  );
};
