import { SelectInput } from '@/components/core/SelectInput'
import { sortByFilters } from '@/utils/constants'
import { faArrowDownWideShort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MagnifyingGlass, X } from 'phosphor-react'
import { useState } from 'react'

interface SearchSectionProps {
  search: string
  handleSetSearch: (value: string) => void
  handleSetSelectedSortBy: (value: string) => void
}

export const SearchSection = ({
  search,
  handleSetSearch,
  handleSetSelectedSortBy,
}: SearchSectionProps) => {
  const [isSortBySelectOpen, setIsSortBySelectOpen] = useState(false)

  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center md:grid md:grid-cols-[1.5fr,1fr] md:justify-between md:justify-items-end">
        <div className="h-12 text-sm truncate w-full flex items-center rounded-md border border-gray-500">
          <input
            className="truncate w-full px-4 py-3 outline-none"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(ev) => handleSetSearch(ev.target.value)}
          />
          {search?.length ? (
            <X
              fill="bg-gray-900"
              className="pr-4 flex w-[2.2rem] h-[2.2rem] shrink-0 cursor-pointer"
              onClick={() => handleSetSearch('')}
            />
          ) : (
            <MagnifyingGlass
              fill="bg-gray-900"
              className="pr-4 flex w-[2.2rem] h-[2.2rem] shrink-0"
            />
          )}
        </div>
        <button
          onClick={() => setIsSortBySelectOpen(!isSortBySelectOpen)}
          className="ml-3 md:hidden rounded-md bg-gray-900 p-1 flex items-center flex-shrink-0 justify-center h-[2.5rem]"
        >
          <FontAwesomeIcon
            icon={faArrowDownWideShort}
            width={32}
            className=" text-white"
          />
        </button>
        <div className="max-md:hidden md:flex md:min-w-[11rem] md:max-w-[15rem] lg:max-w-[16rem] w-full flex items-center justify-center gap-2">
          <p className="whitespace-nowrap text-sm">Sort by</p>
          <SelectInput
            label="Sort"
            placeholder="Sort by..."
            data={sortByFilters}
            onSelect={(value: string) => handleSetSelectedSortBy(value)}
          />
        </div>
      </div>
      {isSortBySelectOpen && (
        <div className="flex mt-4 md:hidden items-center justify-center gap-2">
          <SelectInput
            label="Sort"
            placeholder="Sort by..."
            data={sortByFilters}
            onSelect={(value: string) => handleSetSelectedSortBy(value)}
          />
        </div>
      )}
    </div>
  )
}
