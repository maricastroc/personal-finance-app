import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";

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
          text-ink-100 bg-surface-700 border border-surface-600 rounded-lg
          focus:border-beige-500 focus:outline-none focus:ring-secondary-green focus:ring-2 focus:ring-offset-2
        "
        aria-label={label}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className="ml-2 text-ink-300">
          <ChevronDown size={16} />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="
            z-[10000] mt-1 text-ink-100 rounded-lg shadow-2xl
            border border-surface-600 max-h-40 overflow-y-auto
          "
          style={
            contentWidth
              ? { width: `${contentWidth}px`, background: "var(--surface-700)" }
              : { background: "var(--surface-700)" }
          }
        >
          <Select.ScrollUpButton
            className="flex items-center justify-center text-ink-300 hover:text-ink-100 py-1"
            aria-label="Scroll up"
          >
            <ChevronUp size={16} />
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
        flex items-center px-4 py-2 text-sm rounded-md
        focus:outline-none focus:ring-2 focus:ring-blue-500

        ${
          disabled
            ? "text-ink-400 cursor-not-allowed"
            : "text-ink-100 cursor-pointer hover:bg-surface-600"
        }
      `}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
);

SelectItem.displayName = "SelectItem";
