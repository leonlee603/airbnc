import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FormInputType = {
  name: string;
  type: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
};

export default function FormInput(props: FormInputType) {
  const { name, type, label, defaultValue, placeholder } = props;

  return (
    <div className="mb-2">
      <Label htmlFor={name} className="capitalize">
        {label || name}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </div>
  );
}
