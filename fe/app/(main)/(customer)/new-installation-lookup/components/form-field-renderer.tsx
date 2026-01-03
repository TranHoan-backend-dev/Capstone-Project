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
          label={field.label}
          defaultValue={field.defaultValue}
          isRequired={field.required}
          isDisabled={field.disabled}
          variant="bordered"
          radius="md"
          labelPlacement="inside"
        />
      );

    case "date":
      return (
        <DatePicker
          label={field.label}
          isRequired={field.required}
          isDisabled={field.disabled}
          variant="bordered"
          radius="md"
          labelPlacement="inside"
          className="w-full"
        />
      );

    case "select":
      return (
        <Select
          label={field.label}
          defaultSelectedKeys={
            field.defaultValue ? [field.defaultValue] : undefined
          }
          isDisabled={field.disabled}
          variant="bordered"
          radius="md"
          labelPlacement="inside"
        >
          {field.options.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      );
    case "search-input":
      return (
        <SearchInputWithButton
          placeholder={field.label}
          labelPlacement="inside"
          value={value ?? ""}
          onValueChange={onValueChange ?? (() => {})}
          onSearch={field.onSearchClick}
          className="font-bold"
        />
      );
  }
};
