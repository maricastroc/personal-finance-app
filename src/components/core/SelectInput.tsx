import React from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

interface DataProps {
  id?: string | number;
  name?: string | number;
  isUsed?: boolean;
}

interface SelectInputProps {
  label: string;
  data: DataProps[];
  selectedBudgetsCategories?: string[];
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
  selectedBudgetsCategories,
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
        className="h-12 flex items-center justify-between w-full px-4 py-2 text-sm text-ink-100 bg-surface-700 border border-surface-600 focus:outline-2 focus:outline-accent-green focus:outline-offset-1 rounded-lg"
        aria-label={label}
      >
        <Select.Value className="text-ink-100" placeholder={placeholder} />
        <Select.Icon className="ml-2 text-ink-300">
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="z-[10000] min-w-full mt-1 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
          style={{
            background: "var(--surface-700)",
            border: "1px solid var(--card-border)",
            width: "var(--radix-select-trigger-width)",
            maxHeight: "200px",
          }}
          sideOffset={5}
        >
          <Select.ScrollUpButton
            className="flex items-center justify-center text-ink-300 hover:text-ink-100 py-1"
            aria-label="Scroll up"
          >
            <ChevronUp size={16} />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            <Select.Group>
              {includeAll && <SelectItem value="all">All</SelectItem>}

              {data.map((item, index) => (
                <SelectItem
                  key={index}
                  value={String(item.name)}
                  disabled={selectedBudgetsCategories?.includes(
                    String(item.name)
                  )}
                >
                  {item.name}
                </SelectItem>
              ))}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton
            className="flex items-center justify-center text-ink-300 hover:text-ink-100 py-1"
            aria-label="Scroll down"
          >
            <ChevronDown size={16} />
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
            ? "text-ink-400 cursor-not-allowed"
            : "text-ink-100 cursor-pointer hover:bg-surface-600"
        }
      `}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>

      <Select.ItemIndicator className="absolute right-3 flex items-center rounded-full bg-accent-green">
        <Check className="w-4 h-4 text-white" />
      </Select.ItemIndicator>

      {disabled && (
        <span className="ml-auto text-xs text-ink-400">Already used</span>
      )}
    </Select.Item>
  )
);

SelectItem.displayName = "SelectItem";
