import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

interface DataProps {
  id?: string | number;
  name?: string | number;
}

interface SelectUserProps {
  label: string;
  data: DataProps[];
  onSelect: (value: string) => Promise<void>;
  placeholder: string;
  contentWidth?: number | null;
}

export const SelectUser = ({
  label,
  data,
  onSelect,
  placeholder,
  contentWidth = null,
}: SelectUserProps) => {
  return (
    <Select.Root onValueChange={async (value) => await onSelect(value)}>
      {/* Label para screen readers */}
      <label className="sr-only">{label}</label>

      <Select.Trigger
        className="
          h-12 flex items-center justify-between w-full px-4 py-2 text-sm
          text-grey-900 bg-white border border-beige-500 rounded-md shadow-sm
          focus:border-beige-500 focus:outline-none focus:ring-grey-900 focus:ring-2 focus:ring-offset-2
        "
        aria-label={label}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-2 text-grey-900">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="
            z-[10000] mt-1 bg-white text-grey-500 rounded-md shadow-lg
            border border-grey-300 max-h-40 overflow-y-auto
          "
          style={contentWidth ? { width: `${contentWidth}px` } : undefined}
        >
          <Select.ScrollUpButton
            className="flex items-center justify-center text-grey-500 hover:text-grey-900"
            aria-label="Scroll up"
          >
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            <Select.Group>
              {data.map((item, index) => (
                <SelectItem key={index} value={String(item.id)}>
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
        flex items-center px-4 py-2 text-sm rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500

        ${
          disabled
            ? "text-grey-500 cursor-not-allowed"
            : "text-grey-900 cursor-pointer hover:bg-blue-100 focus:bg-blue-100"
        }
      `}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
);

SelectItem.displayName = "SelectItem";
