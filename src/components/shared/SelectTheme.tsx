import React, { ReactNode } from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

interface DataProps {
  label: ReactNode;
  value: string | number;
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
            z-[10000] w-[190px] h-40 overflow-y-scroll mt-1 
            bg-white text-grey-500 rounded-md shadow-lg 
            border border-grey-300
          "
        >
          <Select.ScrollUpButton className="flex items-center justify-center text-grey-500 hover:text-grey-900">
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            <Select.Group>
              {data.map((item, index) => (
                <SelectItem key={index} value={String(item.value)}>
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
      ...props
    }: {
      children: React.ReactNode;
      value: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => (
    <Select.Item
      ref={ref}
      value={value}
      className="
        flex items-center px-4 py-2 text-sm rounded-md cursor-pointer
        text-grey-900
        hover:bg-blue-100 
        focus:bg-blue-100 
        focus:text-blue-900 gap-10
        outline-none
      "
      {...props}
    >
      <Select.ItemText className="flex items-center gap-2">
        {children}
      </Select.ItemText>
    </Select.Item>
  )
);

SelectItem.displayName = "SelectItem";
