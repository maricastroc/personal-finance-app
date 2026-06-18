import { SelectInput } from "@/components/core/SelectInput";
import { SearchInput } from "@/components/core/SearchInput";
import { sortByFilters } from "@/utils/constants";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface SearchSectionProps {
  search: string;
  handleSetSearch: (value: string) => void;
  handleSetSelectedSortBy: (value: string) => void;
}

export const SearchSection = ({
  search,
  handleSetSearch,
  handleSetSelectedSortBy,
}: SearchSectionProps) => {
  const [isSortBySelectOpen, setIsSortBySelectOpen] = useState(false);

  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center md:grid md:grid-cols-[1.5fr,1fr] md:justify-between md:justify-items-end">
        <div className="flex justify-between gap-3 items-center w-full">
          <SearchInput
            value={search}
            onChange={handleSetSearch}
            label="Search recurring bills"
          />

          <button
            aria-label="Open sort options"
            onClick={() => setIsSortBySelectOpen(!isSortBySelectOpen)}
            className="ml-3 md:hidden rounded-md bg-surface-700 p-1 flex items-center justify-center h-[2.5rem]"
          >
            <ArrowUpDown size={20} className="text-white" />
          </button>
        </div>

        <div className="max-md:hidden md:flex md:min-w-[11rem] md:max-w-[15rem] lg:max-w-[16rem] w-full items-center justify-center gap-2">
          <p className="whitespace-nowrap text-sm">Sort by</p>
          <SelectInput
            label="Sort"
            placeholder="Sort by..."
            data={sortByFilters}
            onSelect={handleSetSelectedSortBy}
          />
        </div>
      </div>

      {isSortBySelectOpen && (
        <div className="flex mt-4 md:hidden items-center justify-center gap-2">
          <SelectInput
            label="Sort"
            placeholder="Sort by..."
            data={sortByFilters}
            onSelect={handleSetSelectedSortBy}
          />
        </div>
      )}
    </div>
  );
};
