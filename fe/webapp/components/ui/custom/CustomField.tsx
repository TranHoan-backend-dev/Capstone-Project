import { Input } from "@heroui/react";
import CustomInput from "./CustomInput";

const CustomField = ({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange?: (v: string) => void;
  type?: string;
}) => (
  <div className="space-y-1">
    {!isEditing && (
      <p className="text-xs font-semibold text-gray-400 uppercase">{label}</p>
    )}

    {isEditing && onChange ? (
      <CustomInput
        label={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <p className="font-medium text-gray-700 dark:text-zinc-300">
        {type === "date" && value
          ? new Date(value).toLocaleDateString("vi-VN")
          : value}
      </p>
    )}
  </div>
);

export default CustomField;
