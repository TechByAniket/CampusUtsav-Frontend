import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { ChevronLeft, ChevronRight, Icon } from "lucide-react";
import type React from "react";


// export const CollegeSignUp: React.FC = () => {
//   const {
//     currentStep,
//     collegeSteps,
//     formData,
//     goToNextStep,
//     goToPreviousStep,
//     updateForm,
//     submitForm,
//     getCurrentStepSchema,
//     isLastStep,
//   } = useMultiStepForm();

//   // Decide which step UI to show
//   const StepComponent = collegeSteps[currentStep].component;
//   const stepName = collegeSteps[currentStep].name;
//   const StepIcon = collegeSteps[currentStep].icon;
//   const stepDescription = collegeSteps[currentStep].description;

//   const totalSteps = collegeSteps.length;
//   const current = currentStep + 1;
//   const percentage = Math.round((current/totalSteps) * 100);

//   console.log(currentStep , "AND" , percentage);

//   return (

//     <div className="space-y-6">
//       <div className="space-y-6">
//         <Progress value={percentage} className="w-full" />
//         <p className="text-sm text-center text-muted-foreground">
//           Step {current} of {totalSteps}
//         </p>
//         <div className="flex flex-col md:flex-row lg:flex-row gap-8 items-center">
//           <span className="h-14 w-14 rounded-full bg-black text-white p-4"><StepIcon className="h-full w-full"/></span>
//           <div className="text-center md:text-left lg:text-left">
//             <h2 className="text-2xl font-bold text-black">{stepName}</h2>
//             <p className="text-sm text-gray-500">{stepDescription}</p>
//           </div>
//         </div>
//       </div>  

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           submitForm(); // or trigger RHF submit via ref (explained below)
//         }}
//         className="space-y-6"
//       >

//       <StepComponent
//         defaultValues={formData}
//         schema={getCurrentStepSchema()}
//         onNext={goToNextStep}
//         onBack={goToPreviousStep}
//         onSubmit={submitForm}
//         updateForm={updateForm}
//         isLastStep={isLastStep}
//       />


//       <div className="flex flex-row justify-between">
//         <Button 
//           variant={"outline"} 
//           onClick={goToPreviousStep} 
//           disabled= {currentStep === 0}
//           className="bg-black text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 ease-in rounded-[8px]"
//           >
//             <ChevronLeft />
//             Previous 
//         </Button>

//         <Button
//          variant={"outline"} 
//          onClick={goToNextStep} 
//          className="bg-black text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 ease-in rounded-[8px]"
//          >
//           {isLastStep ? "Submit" : "Next"}
//           <ChevronRight />
//         </Button>
//       </div>
//       </form>
//     </div>
    
//   );
// };


export const CollegeSignUp: React.FC = () => {
  const {
    currentStep,
    collegeSteps,
    formData,
    goToNextStep,
    goToPreviousStep,
    updateForm,
    submitForm,
    getCurrentStepSchema,
    isLastStep,
  } = useMultiStepForm();

  const StepComponent = collegeSteps[currentStep].component;
  const stepName = collegeSteps[currentStep].name;
  const StepIcon = collegeSteps[currentStep].icon;
  const stepDescription = collegeSteps[currentStep].description;

  const totalSteps = collegeSteps.length;
  const current = currentStep + 1;
  const percentage = Math.round((current / totalSteps) * 100);

  console.log(formData);

  return (
    <div className="space-y-6">

      {/* ---------- HEADER (UNCHANGED) ---------- */}
      <div className="space-y-6">
        <Progress value={percentage} className="w-full" />
        <p className="text-sm text-center text-muted-foreground">
          Step {current} of {totalSteps}
        </p>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          <span className="h-14 w-14 rounded-full bg-black text-white p-4">
            <StepIcon className="h-full w-full" />
          </span>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-black">{stepName}</h2>
            <p className="text-sm text-gray-500">{stepDescription}</p>
          </div>
        </div>
      </div>

      {/* ---------- STEP COMPONENT ---------- */}
      <StepComponent
        defaultValues={formData}
        schema={getCurrentStepSchema()}
        updateForm={updateForm}
        goNext={goToNextStep}        // 🔄 CHANGED: step controls next
        submitForm={submitForm}      // 🔄 CHANGED: step controls submit
        isLastStep={isLastStep}
      />

      {/* ---------- BUTTONS ---------- */}
      <div className="flex flex-row justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          className="bg-black text-white hover:bg-white hover:text-black hover:border-black transition-all rounded-[8px]"
        >
          <ChevronLeft />
          Previous
        </Button>

        {/* 🔄 CHANGED: No onClick, this submits STEP FORM */}
        <Button
          type="submit"
          form="step-form"   // 🔥 KEY CHANGE
          variant="outline"
          className="bg-black text-white hover:bg-white hover:text-black hover:border-black transition-all rounded-[8px]"
        >
          {isLastStep ? "Submit" : "Next"}
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
