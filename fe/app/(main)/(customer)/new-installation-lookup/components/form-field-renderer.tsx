import { Input, DatePicker, Select, SelectItem } from "@heroui/react";

import { FormField } from "@/types/index";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";

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
        <Input
          defaultValue={field.defaultValue}
          isDisabled={field.disabled}
          isRequired={field.required}
          label={field.label}
          labelPlacement="inside"
          radius="md"
          variant="bordered"
        />
      );

    case "date":
      return (
        <DatePicker
          className="w-full"
          isDisabled={field.disabled}
          isRequired={field.required}
          label={field.label}
          labelPlacement="inside"
          radius="md"
          variant="bordered"
        />
      );

    case "select":
      return (
        <Select
          defaultSelectedKeys={
            field.defaultValue ? [field.defaultValue] : undefined
          }
          isDisabled={field.disabled}
          label={field.label}
          labelPlacement="inside"
          radius="md"
          variant="bordered"
        >
          {field.options.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      );
    case "search-input":
      return (
        <SearchInputWithButton
          className="font-bold"
          labelPlacement="inside"
          placeholder={field.label}
          value={value ?? ""}
          onSearch={field.onSearchClick}
          onValueChange={onValueChange ?? (() => {})}
        />
      );
  }
};
