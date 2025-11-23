import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

interface AvatarSelectInputProps {
  label: string;
  data: string[];
  onSelect: (value: string) => void;
  placeholder: string;
  defaultValue?: string | null;
}

export const AvatarSelectInput = ({
  label,
  data,
  onSelect,
  placeholder,
  defaultValue = null,
}: AvatarSelectInputProps) => {
  return (
    <Select.Root
      defaultValue={defaultValue || undefined}
      onValueChange={onSelect}
    >
      <label className="sr-only">{label}</label>

      <Select.Trigger
        className="h-12 flex items-center justify-between w-[4rem] p-2 text-sm text-grey-900 bg-white border border-beige-500 focus:border-beige-500 focus:outline-none focus:ring-secondary-green focus:ring-2 focus:ring-offset-2 rounded-md shadow-sm"
        aria-label={label}
      >
        <Select.Value className="text-grey-900" placeholder={placeholder}>
          {defaultValue && (
            <img
              src={defaultValue}
              alt="Selected avatar"
              className="w-7 h-7 rounded-full"
            />
          )}
        </Select.Value>
        <Select.Icon className="ml-1 text-grey-900">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="z-[10000] min-w-full mt-1 bg-white rounded-md shadow-lg border border-grey-300 max-h-60 overflow-y-auto"
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

          <Select.Viewport className="p-2">
            <Select.Group>
              <div className="flex flex-col gap-2">
                {data.map((imageUrl, index) => (
                  <AvatarSelectItem
                    key={index}
                    value={imageUrl}
                    imageUrl={imageUrl}
                  />
                ))}
              </div>
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

const AvatarSelectItem = React.forwardRef(
  (
    {
      value,
      imageUrl,
      ...props
    }: {
      value: string;
      imageUrl: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => (
    <Select.Item
      ref={ref}
      value={value}
      className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    >
      <Select.ItemText>
        <img
          src={imageUrl}
          alt="Avatar option"
          className="w-10 h-10 rounded-full object-cover"
        />
      </Select.ItemText>
    </Select.Item>
  )
);

AvatarSelectItem.displayName = "AvatarSelectItem";
