import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'

import { PotProps } from '@/types/pot'
import { PotActionsDropdown } from './PotActionsDropdown'

interface HeaderProps {
  pot: PotProps
  isDropdownOpen: boolean
  setIsDropdownOpen: (v: boolean) => void
  setIsEditOpen: (v: boolean) => void
  setIsDeleteOpen: (v: boolean) => void
}

export function PotCardHeader({
  pot,
  isDropdownOpen,
  setIsDropdownOpen,
  setIsEditOpen,
  setIsDeleteOpen,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full relative">
      <div className="flex items-center gap-2">
        <span
          className="w-[16px] h-[16px] rounded-full"
          style={{ backgroundColor: pot.theme.color }}
        />
        <h2 className="text-xl font-bold">{pot.name}</h2>
      </div>

      <div className="relative">
        <FontAwesomeIcon
          className="text-gray-500 cursor-pointer"
          icon={faEllipsis}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        <PotActionsDropdown
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
          setIsEditOpen={setIsEditOpen}
          setIsDeleteOpen={setIsDeleteOpen}
        />
      </div>
    </div>
  )
}
