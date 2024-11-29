import React from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

interface DataProps {
  id?: string | number
  name?: string | number
}

interface SelectInputProps {
  data: DataProps[]
  onSelect: (value: string) => Promise<void>
  placeholder: string
  contentWidth?: string | null
}

export const SelectUser = ({
  data,
  onSelect,
  placeholder,
  contentWidth = null,
}: SelectInputProps) => {
  return (
    <Select.Root onValueChange={async (value: string) => await onSelect(value)}>
      <Select.Trigger
        className="h-12 flex items-center justify-between w-full px-4 py-2 text-sm  text-gray-900 bg-white border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
        aria-label="Category"
      >
        <Select.Value className="text-gray-900" placeholder={placeholder} />
        <Select.Icon className="ml-2 text-gray-900">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className={`z-[10000] ${
            contentWidth ? `w-[${contentWidth}px]` : 'w-[290px]'
          } h-40 overflow-y-scroll mt-1 bg-white text-gray-600 rounded-md shadow-lg border border-gray-200`}
        >
          <Select.ScrollUpButton className="flex items-center justify-center text-gray-500 hover:text-gray-900">
            <ChevronUpIcon />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            <Select.Group>
              {data.map((item, index) => (
                <SelectItem key={index} value={item.id as string}>
                  {item.name}
                </SelectItem>
              ))}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton className="flex items-center justify-center text-gray-500 hover:text-gray-900">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = React.forwardRef(
  (
    {
      children,
      value,
      disabled,
      ...props
    }: {
      children: React.ReactNode
      value: string
      disabled?: boolean
    },
    ref: React.Ref<HTMLDivElement>,
  ) => (
    <Select.Item
      ref={ref}
      value={value}
      className={`flex items-center px-4 py-2 text-sm rounded-md cursor-pointer
        ${
          disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-900 hover:bg-blue-100 focus:bg-blue-100 focus:text-blue-900'
        }
      `}
      disabled={disabled}
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
      {disabled && (
        <span className="ml-auto text-xs text-gray-500">Already used</span>
      )}
    </Select.Item>
  ),
)

SelectItem.displayName = 'SelectItem'
