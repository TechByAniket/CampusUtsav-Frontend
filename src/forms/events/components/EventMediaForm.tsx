import { CustomFormField } from "@/forms/components/CustomFormField";
import { useForm } from "react-hook-form";

type EventMediaFormData = {
  poster?: FileList;
  attachments: string;
};

type Props = {
  defaultValues: Partial<EventMediaFormData>;
  updateForm: (data: Partial<EventMediaFormData>) => void;
  goNext: () => void;
};

export const EventMediaForm: React.FC<Props> = ({
  defaultValues,
  updateForm,
  goNext,
}) => {
  const { register, handleSubmit, formState } =
    useForm<EventMediaFormData>({
      defaultValues,
    });

  const onSubmit = (data: EventMediaFormData) => {

    const attachmentsArray = data.attachments
    ? data.attachments.split(",").map(link => link.trim()).filter(link => link)
    : [];

    updateForm({
      poster: data.poster?.[0], // store first File only
      attachments: attachmentsArray,
    });
    goNext();
  };

  return (
    <form
      id="step-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3"
    >
      {/* Poster Upload */}
      <CustomFormField<EventMediaFormData>
        label="Event Poster"
        name="poster"
        register={register}
        error={formState.errors.poster}
        type="file"
        inputProps={{ accept: "image/*" }}
      />

      {/* Drive links */}
      <CustomFormField<EventMediaFormData>
        label="Attachments (Drive links)"
        name="attachments"
        register={register}
        error={formState.errors.attachments}
        type="input"
        inputProps={{
          placeholder: "Separate multiple links with commas",
        }}
      />
    </form>
  );
};
