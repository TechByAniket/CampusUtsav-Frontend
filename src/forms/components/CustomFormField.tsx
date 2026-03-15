import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RegisterOptions, UseFormRegister, FieldValues, Path } from "react-hook-form";

type CustomFormFieldProps<TFormValues extends FieldValues> = {
  label: string;
  name: Path<TFormValues>; // supports nested paths
  register: UseFormRegister<TFormValues>;
  registerOptions?: RegisterOptions;
  error?: any;
  type?: "input" | "select" | "textarea" | "file";
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  children?: React.ReactNode;
};

export function CustomFormField<TFormValues extends FieldValues>({
  label,
  name,
  register,
  registerOptions,
  error,
  type = "input",
  inputProps,
  textareaProps,
  children,
}: CustomFormFieldProps<TFormValues>) {
  // checkbox class fix
  const checkboxClass = "h-4 w-4 rounded border-gray-300";

  return (
    <div className="flex flex-col gap-1 relative pb-4">
      <Label htmlFor={String(name)}>{label}</Label>

      {/* INPUT */}
      {type === "input" && inputProps?.type !== "checkbox" && (
        <Input
          id={String(name)}
          {...register(name, registerOptions)}
          {...inputProps}
        />
      )}

      {/* CHECKBOX */}
      {type === "input" && inputProps?.type === "checkbox" && (
        <input
          id={String(name)}
          type="checkbox"
          {...register(name, registerOptions)}
          {...inputProps}
          className={checkboxClass + " " + (inputProps?.className || "")}
        />
      )}

      {/* TEXTAREA */}
      {type === "textarea" && (
        <textarea
          id={String(name)}
          {...register(name, registerOptions)}
          {...textareaProps}
          className="border rounded-md p-2"
        />
      )}

      {/* SELECT */}
      {type === "select" && (
        <select
          id={String(name)}
          {...register(name, registerOptions)}
          className="border rounded-md px-3 py-2"
          defaultValue=""
        >
          {children}
        </select>
      )}

      {/* FILE */}
      {type === "file" && (
        <Input
          id={String(name)}
          type="file"
          {...register(name, registerOptions)}
          {...inputProps}
        />
      )}

      {error?.message && (
        <p className="absolute left-0 -bottom-1 text-red-500 text-xs leading-none">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}
