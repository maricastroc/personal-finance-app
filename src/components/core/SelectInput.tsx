import React from "react";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

interface DataProps {
  id?: string | number;
  name?: string | number;
  isUsed?: boolean;
}

interface SelectInputProps {
  label: string;
  data: DataProps[];
  existedCategories?: string[];
  onSelect: (value: string) => void;
  includeAll?: boolean;
  placeholder: string;
  defaultValue?: string | null;
}

export const SelectInput = ({
  label,
  data,
  onSelect,
  includeAll = false,
  existedCategories,
  placeholder,
  defaultValue = null,
}: SelectInputProps) => {
  return (
    <Select.Root
      defaultValue={defaultValue || undefined}
      onValueChange={onSelect}
    >
      <label className="sr-only">{label}</label>

      <Select.Trigger
        className="h-12 flex items-center justify-between w-full px-4 py-2 text-sm text-grey-900 bg-white border border-beige-500 focus:border-beige-500 focus:outline-none focus:ring-secondary-green focus:ring-2 focus:ring-offset-2 rounded-md shadow-sm"
        aria-label={label}
      >
        <Select.Value className="text-grey-900" placeholder={placeholder} />
        <Select.Icon className="ml-2 text-grey-900">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="z-[10000] min-w-full mt-1 bg-white text-grey-500 rounded-md shadow-lg border border-grey-300 max-h-60 overflow-y-auto"
          style={{
            width: "var(--radix-select-trigger-width)",
            maxHeight: "200px",
          }}
          sideOffset={5}
        >
          <Select.ScrollUpButton
            className="flex items-center justify-center text-grey-500 hover:text-grey-900"
            aria-label="Scroll up"
          >
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            <Select.Group>
              {includeAll && <SelectItem value="all">All</SelectItem>}

              {data.map((item, index) => (
                <SelectItem
                  key={index}
                  value={String(item.name)}
                  disabled={existedCategories?.includes(String(item.name))}
                >
                  {item.name}
                </SelectItem>
              ))}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton
            className="flex items-center justify-center text-grey-500 hover:text-grey-900"
            aria-label="Scroll down"
          >
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = React.forwardRef(
  (
    {
      children,
      value,
      disabled,
      ...props
    }: {
      children: React.ReactNode;
      value: string;
      disabled?: boolean;
    },
    ref: React.Ref<HTMLDivElement>
  ) => (
    <Select.Item
      ref={ref}
      value={value}
      disabled={disabled}
      className={`
        flex items-center px-4 w-full py-2 text-sm rounded-md relative
        focus:outline-none
        ${
          disabled
            ? "text-grey-500 cursor-not-allowed"
            : "text-grey-900 cursor-pointer hover:bg-beige-100"
        }
      `}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>

      <Select.ItemIndicator className="absolute right-3 flex items-center rounded-full bg-secondary-green">
        <CheckIcon className="w-4 h-4 text-white" />
      </Select.ItemIndicator>

      {disabled && (
        <span className="ml-auto text-xs text-grey-500">Already used</span>
      )}
    </Select.Item>
  )
);

SelectItem.displayName = "SelectItem";
