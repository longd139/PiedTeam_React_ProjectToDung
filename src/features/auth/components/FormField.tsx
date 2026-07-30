import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}
const FormField = ({
  id,
  label,
  type,
  placeholder,
  register,
  error,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        className={error ? "border-destructive" : ""}
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        required
      />
      {error && <p className="text-destructive text-xs">{error.message}</p>}
    </div>
  );
};

export default FormField;
