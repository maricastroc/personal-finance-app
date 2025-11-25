import React, { ReactNode } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

interface DataProps {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
}

interface SelectThemeProps {
  data: DataProps[];
  onSelect: (value: string) => void;
  defaultValue?: string | null;
}

export const SelectTheme = ({
  data,
  onSelect,
  defaultValue = null,
}: SelectThemeProps) => {
  return (
    <Select.Root
      defaultValue={defaultValue ?? undefined}
      onValueChange={onSelect}
    >
      <Select.Trigger
        className="
          h-12 flex items-center justify-between w-full px-4 py-2 
          text-sm text-grey-900 bg-white border border-grey-500 
          rounded-md shadow-sm 
          focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-grey-900 
          focus-visible:ring-offset-2 
          transition-all
        "
        aria-label="Theme"
      >
        <Select.Value
          className="text-grey-900"
          placeholder="Select a Color..."
        />
        <Select.Icon className="ml-2 text-grey-900">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="
            z-[10000] w-[220px] max-h-52 overflow-y-auto mt-1 
            bg-white text-grey-500 rounded-md shadow-lg 
            border border-grey-300
          "
          style={{
            width: "var(--radix-select-trigger-width)",
            maxHeight: "200px",
          }}
          sideOffset={5}
        >
          <Select.ScrollUpButton className="flex items-center justify-center text-grey-500 hover:text-grey-900">
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            <Select.Group>
              {data.map((item, index) => (
                <SelectItem
                  key={index}
                  value={String(item.value)}
                  disabled={item.disabled}
                >
                  {item.label}
                </SelectItem>
              ))}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center text-grey-500 hover:text-grey-900">
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
      disabled = false,
      ...props
    }: {
      children: React.ReactNode;
      value: string;
      disabled?: boolean;
      rightLabel?: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => (
    <Select.Item
      ref={ref}
      value={value}
      disabled={disabled}
      className={`
        flex items-center justify-between px-4 py-2 text-sm rounded-md 
        outline-none
        ${
          disabled
            ? "text-grey-500 cursor-not-allowed"
            : "text-grey-900 cursor-pointer hover:bg-blue-100 focus:bg-blue-100"
        }
      `}
      {...props}
    >
      <Select.ItemText className="flex items-center gap-2">
        {children}
      </Select.ItemText>

      {disabled && (
        <span className="ml-auto text-xs text-grey-500">Already used</span>
      )}
    </Select.Item>
  )
);

SelectItem.displayName = "SelectItem";
