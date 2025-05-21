import { MagnifyingGlass, X } from 'phosphor-react'
import { useState } from 'react'
import {
  faArrowDownWideShort,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SelectInput } from '@/components/core/SelectInput'
import { CategoryProps } from '@/types/category'
import { sortByFilters } from '@/utils/constants'

interface SearchSectionProps {
  search: string
  category: string | null | undefined
  categories: CategoryProps[]
  handleSetSearch: (value: string) => void
  handleSetCategory: (value: string) => void
  handleSetSortBy: (value: string) => void
}
export const SearchSection = ({
  search,
  category,
  categories,
  handleSetSearch,
  handleSetCategory,
  handleSetSortBy,
}: SearchSectionProps) => {
  const [isCategoriesSelectOpen, setIsCategoriesSelectOpen] = useState(false)

  const [isSortBySelectOpen, setIsSortBySelectOpen] = useState(false)

  return (
    <div className="flex flex-col md:grid md:grid-cols-[1fr,2fr] lg:flex lg:flex-row lg:justify-between w-full gap-2 pb-6 md:gap-6">
      <div className="flex justify-between gap-3 items-center gap-y-10 lg:w-full xl:max-w-[28rem]">
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
          onClick={() => setIsCategoriesSelectOpen(!isCategoriesSelectOpen)}
          className="ml-3 md:hidden rounded-md bg-gray-900 p-1 flex items-center flex-shrink-0 justify-center h-[2.5rem]"
        >
          <FontAwesomeIcon icon={faFilter} width={32} className=" text-white" />
        </button>

        <button
          onClick={() => setIsSortBySelectOpen(!isSortBySelectOpen)}
          className="md:hidden rounded-md bg-gray-900 p-1 flex items-center flex-shrink-0 justify-center h-[2.5rem]"
        >
          <FontAwesomeIcon
            icon={faArrowDownWideShort}
            width={32}
            className=" text-white"
          />
        </button>
      </div>

      <div className="hidden md:flex w-full gap-5 items-center md:justify-end">
        {categories && (
          <div className="md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center justify-center gap-2">
            <p className="text-sm">Category</p>
            <SelectInput
              includeAll
              placeholder="Select..."
              defaultValue={(category as string) || 'all'}
              data={categories}
              onSelect={(value: string) => handleSetCategory(value)}
            />
          </div>
        )}

        <div className="md:min-w-[11rem] md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center justify-center gap-2">
          <p className="whitespace-nowrap text-sm">Sort by</p>
          <SelectInput
            placeholder="Sort by..."
            data={sortByFilters}
            onSelect={(value: string) => handleSetSortBy(value)}
          />
        </div>
      </div>

      {isCategoriesSelectOpen && categories && (
        <div className="flex md:hidden items-center justify-center gap-2">
          <SelectInput
            includeAll
            placeholder="Select a Category..."
            data={categories}
            onSelect={(value: string) => handleSetCategory(value)}
          />
        </div>
      )}

      {isSortBySelectOpen && (
        <div className="flex md:hidden items-center justify-center gap-2">
          <SelectInput
            placeholder="Sort by..."
            data={sortByFilters}
            onSelect={(value: string) => handleSetSortBy(value)}
          />
        </div>
      )}
    </div>
  )
}
