"use client";

import {
  Input,
  DatePicker,
  Select,
  SelectItem,
  Button,
  Checkbox,
  Textarea,
} from "@heroui/react";

import { FormField } from "@/types/index";
import { SearchIcon } from "@/config/chip-and-icon";
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
    case "search":
      return (
        <div className="flex gap-2">
          <Input label={field.label} variant="bordered" />
          <Button isIconOnly variant="bordered">
            <SearchIcon />
          </Button>
        </div>
      );

    case "checkbox":
  if (field.options?.length) {
    return (
      <div className="flex items-center pt-4 gap-6 whitespace-nowrap">
        {field.options.map((opt) => (
          <Checkbox key={opt.key}>
            {opt.label}
          </Checkbox>
        ))}
      </div>
    );
  }

  return <Checkbox>{field.label}</Checkbox>;


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
