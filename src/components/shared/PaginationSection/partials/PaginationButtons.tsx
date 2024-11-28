import { PaginationBtn } from './PaginationButton'

interface PaginationButtonsProps {
  currentPage: number
  maxVisibleButtons: number
  totalPages: number
  handleSetCurrentPage: (value: number) => void
}

export const PaginationButtons = ({
  currentPage,
  maxVisibleButtons,
  totalPages,
  handleSetCurrentPage,
}: PaginationButtonsProps) => {
  const buttons = []
  const startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2))
  const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1)

  for (let i = startPage; i <= endPage; i++) {
    buttons.push(
      <PaginationBtn
        key={i}
        number={i}
        onClick={() => handleSetCurrentPage(i)}
        disabled={currentPage === i}
      />,
    )
  }

  if (startPage > 1) {
    buttons.unshift(<span key="start-ellipsis">...</span>)
  }
  if (endPage < totalPages) {
    buttons.push(<span key="end-ellipsis">...</span>)
  }

  return buttons
}
