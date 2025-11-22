import { useState } from "react";
import {
  faArrowDownWideShort,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SelectInput } from "@/components/core/SelectInput";
import { CategoryProps } from "@/types/category";
import { sortByFilters } from "@/utils/constants";
import { SearchInput } from "@/components/core/SearchInput";

interface SearchSectionProps {
  search: string;
  category: string | null | undefined;
  categories: CategoryProps[] | undefined;
  handleSetSearch: (value: string) => void;
  handleSetCategory: (value: string) => void;
  handleSetSortBy: (value: string) => void;
}

export const SearchSection = ({
  search,
  category,
  categories,
  handleSetSearch,
  handleSetCategory,
  handleSetSortBy,
}: SearchSectionProps) => {
  const [isCategoriesSelectOpen, setIsCategoriesSelectOpen] = useState(false);

  const [isSortBySelectOpen, setIsSortBySelectOpen] = useState(false);

  return (
    <section
      aria-label="Search and filter transactions"
      className="flex flex-col md:grid md:grid-cols-[1fr,2fr] lg:flex lg:flex-row lg:justify-between w-full gap-2 pb-6 md:gap-6"
    >
      <div className="flex justify-between gap-3 items-center lg:w-full xl:max-w-[28rem]">
        <SearchInput
          value={search}
          onChange={handleSetSearch}
          label="Search transactions"
        />

        <button
          aria-label="Open category filter"
          onClick={() => setIsCategoriesSelectOpen(!isCategoriesSelectOpen)}
          className="ml-3 md:hidden rounded-md bg-grey-900 p-1 flex items-center flex-shrink-0 justify-center h-[2.5rem]"
        >
          <FontAwesomeIcon icon={faFilter} width={32} className="text-white" />
        </button>

        <button
          aria-label="Open sort options"
          onClick={() => setIsSortBySelectOpen(!isSortBySelectOpen)}
          className="md:hidden rounded-md bg-grey-900 p-1 flex items-center flex-shrink-0 justify-center h-[2.5rem]"
        >
          <FontAwesomeIcon
            icon={faArrowDownWideShort}
            width={32}
            className="text-white"
          />
        </button>
      </div>

      <div className="hidden md:flex w-full gap-5 items-center md:justify-end">
        <div className="md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center gap-2">
          <label htmlFor="category-select" className="text-sm">
            Category
          </label>

          <SelectInput
            label="Category"
            includeAll
            placeholder="Select..."
            defaultValue={(category as string) || "all"}
            data={categories || []}
            onSelect={handleSetCategory}
          />
        </div>

        <div className="md:min-w-[11rem] md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center gap-2">
          <label htmlFor="sort-select" className="whitespace-nowrap text-sm">
            Sort by
          </label>

          <SelectInput
            label="Sort by"
            placeholder="Sort by..."
            data={sortByFilters}
            onSelect={handleSetSortBy}
          />
        </div>
      </div>

      {isCategoriesSelectOpen && categories && (
        <div className="flex md:hidden items-center justify-center gap-2">
          <SelectInput
            label="Category"
            includeAll
            placeholder="Select a category..."
            data={categories}
            onSelect={handleSetCategory}
          />
        </div>
      )}

      {isSortBySelectOpen && (
        <div className="flex md:hidden items-center justify-center gap-2">
          <SelectInput
            label="Sort by"
            placeholder="Sort by..."
            data={sortByFilters}
            onSelect={handleSetSortBy}
          />
        </div>
      )}
    </section>
  );
};
