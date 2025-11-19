import { PaginationBtn } from "./partials/PaginationButton";
import { PaginationButtons } from "./partials/PaginationButtons";

interface PaginationSectionProps {
  currentPage: number;
  maxVisibleButtons: number;
  totalPages: number;
  handleSetCurrentPage: (value: number) => void;
}

export const PaginationSection = ({
  currentPage,
  maxVisibleButtons,
  totalPages,
  handleSetCurrentPage,
}: PaginationSectionProps) => {
  return (
    <>
      <PaginationBtn
        variant="left"
        number={0}
        disabled={currentPage === 1}
        onClick={() => handleSetCurrentPage(currentPage - 1)}
      />
      <div className="flex items-center justify-center gap-3">
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          maxVisibleButtons={maxVisibleButtons}
          handleSetCurrentPage={(value: number) => handleSetCurrentPage(value)}
        />
      </div>
      <PaginationBtn
        variant="right"
        number={0}
        disabled={currentPage === totalPages}
        onClick={() => handleSetCurrentPage(currentPage + 1)}
      />
    </>
  );
};
