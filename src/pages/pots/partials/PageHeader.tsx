import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  buttonLabel: string
  icon?: ReactNode
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  modalId: string
  children: ReactNode
}

export function PageHeader({
  title,
  buttonLabel,
  icon,
  isOpen,
  setIsOpen,
  modalId,
  children,
}: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between w-full mb-8">
      <h1 className="text-gray-900 font-bold text-3xl">{title}</h1>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={modalId}
            className="font-semibold rounded-md p-3 px-4 flex gap-2 items-center transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500"
          >
            {icon}
            {buttonLabel}
          </button>
        </Dialog.Trigger>

        {children}
      </Dialog.Root>
    </header>
  )
}
