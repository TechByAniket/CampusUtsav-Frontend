import { useState } from "react";

type UseEventMultiStepFormProps = {
  steps: any[];
  initialValues: Record<string, any>;
  onSubmit: (data: any) => Promise<void> | void;
};

export const useEventMultiStepForm = ({
  steps,
  initialValues,
  onSubmit,
}: UseEventMultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialValues);

  const goToNextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));

  const goToPreviousStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateForm = (data: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const submitForm = async () => {
    await onSubmit(formData);
  };

  const getCurrentStepSchema = () => steps[currentStep].schema;

  const isLastStep = currentStep === steps.length - 1;

  return {
    currentStep,
    steps,
    formData,
    goToNextStep,
    goToPreviousStep,
    updateForm,
    submitForm,
    getCurrentStepSchema,
    isLastStep,
  };
};
