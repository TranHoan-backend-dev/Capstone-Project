"use client";

import { Checkbox, Textarea } from "@heroui/react";

import { FormField } from "@/types";
import { SearchIcon } from "@/config/chip-and-icon";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomButton from "@/components/ui/custom/CustomButton";

export const FormFieldRenderer = ({
  field,
  value,
  onValueChange,
}: {
  field: FormField;
  value?: string;
  onValueChange?: (val: string) => void;
}) => {
  switch (field.type) {
    case "input":
      return (
        <CustomInput
          defaultValue={field.defaultValue}
          isDisabled={field.disabled}
          isRequired={field.required}
          label={field.label}
        />
      );

    case "date":
      return (
        <CustomDatePicker
          className="w-full"
          isDisabled={field.disabled}
          isRequired={field.required}
          label={field.label}
        />
      );

    case "select":
      return (
        <CustomSelect
          defaultSelectedKeys={
            field.defaultValue ? [field.defaultValue] : undefined
          }
          isDisabled={field.disabled}
          label={field.label}
          options={field.options.map((opt) => ({
            label: opt.label,
            value: opt.key,
          }))}
        />
      );
    case "search":
      return (
        <div className="flex gap-2">
          <CustomInput label={field.label} variant="bordered" />
          <CustomButton isIconOnly variant="bordered">
            <SearchIcon />
          </CustomButton>
        </div>
      );

    case "checkbox":
      if (field.options?.length) {
        return (
          <div className="flex items-center pt-4 gap-6 whitespace-nowrap">
            {field.options.map((opt) => (
              <Checkbox key={opt.key}>{opt.label}</Checkbox>
            ))}
          </div>
        );
      }

      return <Checkbox>{field.label}</Checkbox>;

    case "search-input":
      return (
        <SearchInputWithButton
          placeholder={field.label}
          value={value ?? ""}
          onSearch={field.onSearchClick}
          onValueChange={onValueChange ?? (() => {})}
        />
      );
    case "textarea":
      return (
        <Textarea
          label={field.label}
          labelPlacement="inside"
          rows={field.rows ?? 4}
          isDisabled={field.disabled}
          isRequired={field.required}
          variant="bordered"
          radius="md"
        />
      );
    default:
      return null;
  }
};
