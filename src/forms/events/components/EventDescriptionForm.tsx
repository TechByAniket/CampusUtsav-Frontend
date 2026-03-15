import { Button } from "@/components/ui/button";
import { CustomFormField } from "@/forms/components/CustomFormField";
import { generateEventDescriptionAI } from "@/services/eventService";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type EventDescriptionFormData = {
  title: string;
  // description: string;
  eventCategory: string;
  eventType: string;
};

type Props = {
  defaultValues: Partial<EventDescriptionFormData>;
  updateForm: (data: Partial<EventDescriptionFormData>) => void;
  goNext: () => void;
};


  export const EventDescriptionForm: React.FC<Props> = ({
    defaultValues,
    updateForm,
    goNext,
  }) => {
    const {
      register,
      handleSubmit,
      formState,
      setValue,
    } = useForm<EventDescriptionFormData>({
      defaultValues,
    });

    const onSubmit = (data: EventDescriptionFormData) => {
      updateForm(data);
      goNext();
    };

    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [tone, setTone] = useState<"PROFESSIONAL" | "CASUAL" | "FESTIVE">("PROFESSIONAL");
    const [maxLength, setMaxLength] = useState(150);


    const openAIPrompt = () => {
      setAiPrompt(" "); // just to open the prompt UI
    };

    const generateDescriptionWithAI = async () => {
    try {
      setAiLoading(true);

      const prompt =
        aiPrompt.trim() ||
        "Write a short event description with bullet points and bold highlights.";

      const data = await generateEventDescriptionAI({
        prompt,
        tone,
        maxLength,
      });

      setValue("description", data.generatedText);
      setAiPrompt("");
    } catch (error) {
      console.error("AI generation failed", error);
    } finally {
      setAiLoading(false);
    }
  };


    return (
      <form id="step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        
        {/* Description */}
        <CustomFormField<EventDescriptionFormData>
          label="Description"
          name="description"
          register={register}
          error={formState.errors.description}
          type="textarea"
          registerOptions={{ required: "Description is required" }}
          textareaProps={{ placeholder: "Describe the event", rows: 4 }}
        />

        {aiPrompt !== "" && (
    <div className="mt-2 p-3 border rounded-lg bg-white shadow-sm space-y-3">
      <p className="text-sm font-medium">AI Prompt</p>

      <textarea
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        className="w-full border rounded-md p-2"
        placeholder="Example: Write a short event description with bullets and bold points"
        rows={3}
      />

      {/* AI Controls */}
      <div className="flex gap-3">
        {/* Tone */}
        <div className="flex flex-col w-1/2">
          <label className="text-xs font-medium text-gray-600 mb-1">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="PROFESSIONAL">Professional</option>
            <option value="CASUAL">Casual</option>
            <option value="FESTIVE">Festive</option>
          </select>
        </div>

        {/* Length */}
        <div className="flex flex-col w-1/2">
          <label className="text-xs font-medium text-gray-600 mb-1">Length</label>
          <select
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value={100}>Short</option>
            <option value={150}>Medium</option>
            <option value={250}>Long</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          className="px-3 py-1 rounded-md border text-sm"
          onClick={() => setAiPrompt("")}
        >
          Cancel
        </button>

        <button
          type="button"
          className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm"
          onClick={generateDescriptionWithAI}
          disabled={aiLoading}
        >
          {aiLoading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  )}


        <Button
          type="button"
          className="text-xs font-semibold text-indigo-600 hover:underline"
          onClick={openAIPrompt}
        >
          Generate with AI
        </Button>
      </form>
    );
  };
