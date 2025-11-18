import { useOutsideAndEscape } from '@/hooks/useClickOutside'

interface Props {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  setIsEditOpen: (v: boolean) => void
  setIsDeleteOpen: (v: boolean) => void
}

export function PotActionsDropdown({
  isOpen,
  setIsOpen,
  setIsEditOpen,
  setIsDeleteOpen,
}: Props) {
  const dropdownRef = useOutsideAndEscape<HTMLDivElement>({
    enabled: isOpen,
    onClickOutside: () => setIsOpen(false),
    onEscape: () => setIsOpen(false),
  })

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-[1.5rem] w-[8.5rem] bg-white shadow-xl p-3 rounded-lg flex flex-col gap-2 z-10"
    >
      <button
        onClick={() => {
          setIsEditOpen(true)
          setIsOpen(false)
        }}
        className="text-sm text-left text-gray-800 hover:text-gray-500"
      >
        Edit Pot
      </button>

      <span className="h-[1px] w-full bg-gray-200" />

      <button
        onClick={() => {
          setIsDeleteOpen(true)
          setIsOpen(false)
        }}
        className="text-sm text-left text-secondary-red hover:brightness-125"
      >
        Delete Pot
      </button>
    </div>
  )
}
