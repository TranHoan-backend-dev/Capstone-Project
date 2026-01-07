"use client";

import { FormField } from "@/types";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomSelect from "@/components/ui/custom/CustomSelect";

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
    case "search-input":
      return (
        <SearchInputWithButton
          placeholder={field.label}
          value={value ?? ""}
          onSearch={field.onSearchClick}
          onValueChange={onValueChange ?? (() => {})}
        />
      );
  }
};
