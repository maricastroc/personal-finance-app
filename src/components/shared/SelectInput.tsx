import React from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

interface DataProps {
  id: number | string
  name: string
}

interface SelectInputProps {
  data: DataProps[]
  onSelect: (value: string) => void
  includeAll?: boolean
  placeholder: string
}

export const SelectInput = ({
  data,
  onSelect,
  includeAll = false,
  placeholder,
}: SelectInputProps) => (
  <Select.Root onValueChange={onSelect}>
    <Select.Trigger
      className="h-12 flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
      aria-label="Category"
    >
      <Select.Value className="text-gray-400" placeholder={placeholder} />
      <Select.Icon className="ml-2 text-gray-400">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        position="popper"
        className="z-10 w-[190px] h-40 overflow-y-scroll mt-1 bg-white rounded-md shadow-lg border border-gray-200"
      >
        <Select.ScrollUpButton className="flex items-center justify-center text-gray-500 hover:text-gray-900">
          <ChevronUpIcon />
        </Select.ScrollUpButton>

        <Select.Viewport className="p-1">
          <Select.Group>
            {includeAll && <SelectItem value="all">All</SelectItem>}
            {data.map((item, index) => (
              <SelectItem key={index} value={item.name}>
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

const SelectItem = React.forwardRef(
  (
    { children, value, ...props }: { children: React.ReactNode; value: string },
    ref: React.Ref<HTMLDivElement>,
  ) => (
    <Select.Item
      ref={ref}
      value={value}
      className="flex items-center px-4 py-2 text-sm text-gray-700 rounded-md cursor-pointer hover:bg-blue-100 focus:bg-blue-100 focus:text-blue-900"
      {...props}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  ),
)

SelectItem.displayName = 'SelectItem'
