import { CustomFormField } from "@/forms/components/CustomFormField";
import { useForm } from "react-hook-form";

type ContactDetails = {
  person1: { name: string; contact: string };
  person2: { name: string; contact: string };
};

type ExtraInfo = {
  contactInfo: {
    person1: { name: string; contact: string; email: string };
    person2: { name: string; contact: string; email: string };
  };
};


export type EventMetaFormData = {
  is_active: boolean;
  is_featured: boolean;
  status: "draft" | "published";
  contactDetails: ContactDetails;
  extraInfo: ExtraInfo; // nested persons
};

type Props = {
  defaultValues: Partial<EventMetaFormData>;
  updateForm: (data: Partial<EventMetaFormData>) => void;
  goNext: () => void;
  isLastStep: boolean;
  submitForm: () => void;
};

export const EventMetaForm: React.FC<Props> = ({
  defaultValues,
  updateForm,
  goNext,
  isLastStep,
  submitForm,
}) => {
  const { register, handleSubmit, formState } = useForm<EventMetaFormData>({
    defaultValues,
  });

  const onSubmit = (data: EventMetaFormData) => {
    updateForm(data);
    if (isLastStep) {
    submitForm();   // ✅ CALL API
  } else {
    goNext();       // ✅ MOVE STEP
  }
  };

  return (
    <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Person 1 */}
      <h3 className="font-semibold">Person 1</h3>
      <CustomFormField<EventMetaFormData>
        label="Name"
        name="contactDetails.person1.name"
        register={register}
        error={formState.errors?.contactDetails?.person1?.name}
        type="input"
        inputProps={{ placeholder: "Enter name" }}
      />
      <CustomFormField<EventMetaFormData>
        label="Contact Number"
        name="contactDetails.person1.contact"
        register={register}
        error={formState.errors?.contactDetails?.person1?.contact}
        type="input"
        inputProps={{ placeholder: "Enter contact number", type: "tel" }}
      />

      {/* <CustomFormField<EventMetaFormData>
        label="Email"
        name="extraInfo.person1.email"
        register={register}
        error={formState.errors?.extraInfo?.person1?.email}
        type="input"
        inputProps={{ placeholder: "Enter email", type: "email" }}
      /> */}

      {/* Person 2 */}
      <h3 className="font-semibold mt-4">Person 2</h3>
      <CustomFormField<EventMetaFormData>
        label="Name"
        name="contactDetails.person2.name"
        register={register}
        error={formState.errors?.contactDetails?.person2?.name}
        type="input"
        inputProps={{ placeholder: "Enter name" }}
      />
      <CustomFormField<EventMetaFormData>
        label="Contact Number"
        name="contactDetails.person2.contact"
        register={register}
        error={formState.errors?.contactDetails?.person2?.contact}
        type="input"
        inputProps={{ placeholder: "Enter contact number", type: "tel" }}
      />
      {/* <CustomFormField<EventMetaFormData>
        label="Email"
        name="extraInfo.person2.email"
        register={register}
        error={formState.errors?.extraInfo?.person2?.email}
        type="input"
        inputProps={{ placeholder: "Enter email", type: "email" }}
      /> */}
    </form>
  );
};
