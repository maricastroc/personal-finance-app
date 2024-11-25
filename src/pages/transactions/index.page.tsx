import Layout from '@/components/layouts/layout.page'
import iconSortMobile from '../../../public/assets/images/icon-sort-mobile.svg'
import iconFilterMobile from '../../../public/assets/images/icon-filter-mobile.svg'
import { MagnifyingGlass } from 'phosphor-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import useRequest from '@/utils/useRequest'
import { TransactionProps } from '@/types/transaction'
import { TransactionCard } from '@/components/shared/TransactionCard'
import { formatToDollar } from '@/utils/formatToDollar'
import { format } from 'date-fns'
import { PaginationBtn } from './partials/PaginationBtn'
import { CategoryProps } from '@/types/category'
import { SelectInput } from '@/components/shared/SelectInput'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'

function calculateTotalPages(totalRecords: number, limit: number): number {
  return Math.ceil(totalRecords / limit)
}

const filters = [
  {
    id: 1,
    name: 'Highest',
  },
  {
    id: 2,
    name: 'Lowest',
  },
  {
    id: 3,
    name: 'A to Z',
  },
  {
    id: 4,
    name: 'Z to A',
  },
  {
    id: 5,
    name: 'Oldest',
  },
  {
    id: 6,
    name: 'Latest',
  },
]

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1)

  const [maxVisibleButtons, setMaxVisibleButtons] = useState(3)

  const [isCategoriesSelectOpen, setIsCategoriesSelectOpen] = useState(false)

  const [isSortBySelectOpen, setIsSortBySelectOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState('all')

  const [selectedSortBy, setSelectedSortBy] = useState('latest')

  const { data } = useRequest<{
    transactions: TransactionProps[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }>({
    url: `/transactions?page=${currentPage}&limit=10&filterByName=${selectedCategory.toLowerCase()}&sortBy=${formatToSnakeCase(
      selectedSortBy,
    )}`,
    method: 'GET',
  })

  const { data: categories } = useRequest<CategoryProps[]>({
    url: '/categories',
    method: 'GET',
  })

  const transactions = data?.transactions || []

  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  }

  const totalPages = calculateTotalPages(pagination.total, pagination.limit)

  useEffect(() => {
    const updateMaxVisibleButtons = () => {
      if (window.innerWidth >= 1024) {
        setMaxVisibleButtons(6)
      } else if (window.innerWidth >= 768) {
        setMaxVisibleButtons(4)
      } else {
        setMaxVisibleButtons(3)
      }
    }

    updateMaxVisibleButtons()
    window.addEventListener('resize', updateMaxVisibleButtons)
    return () => window.removeEventListener('resize', updateMaxVisibleButtons)
  }, [])

  const renderPaginationButtons = () => {
    const buttons = []
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2),
    )
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1)

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationBtn
          key={i}
          number={i}
          onClick={() => setCurrentPage(i)}
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

  return (
    <Layout>
      <div
        className={`flex-grow px-4 py-5 md:p-10 lg:pl-0 pb-20 md:pb-32 lg:pb-8`}
      >
        <h1 className="text-gray-900 font-bold text-3xl">Transactions</h1>
        <div className="mt-8 flex flex-col bg-white px-5 py-6 rounded-md">
          <div className="flex flex-col md:grid md:grid-cols-[1fr,2fr] lg:flex lg:flex-row lg:justify-between w-full gap-2 pb-6 md:gap-6">
            <div className="grid grid-cols-[1fr,0.2fr,0.2fr] md:flex justify-between gap-2 gap-y-10 lg:w-full xl:max-w-[28rem]">
              <div className="h-12 text-sm truncate w-full grid grid-cols-[1fr,28px] justify-evenly items-center rounded-md border border-gray-500">
                <input
                  className="truncate w-full px-4 py-3 outline-none"
                  type="text"
                  placeholder="Search..."
                />
                <MagnifyingGlass
                  fill="bg-gray-900"
                  className="pr-4 flex w-[2.2rem] h-[2.2rem] shrink-0"
                />
              </div>

              <button
                onClick={() => setIsSortBySelectOpen(!isSortBySelectOpen)}
                className="md:hidden ml-4 flex items-center justify-center w-[10vw] h-full"
              >
                <Image width={22} src={iconSortMobile} alt="" />
              </button>

              <button
                onClick={() =>
                  setIsCategoriesSelectOpen(!isCategoriesSelectOpen)
                }
                className="md:hidden flex relative items-center justify-center h-full"
              >
                <Image width={22} height={20} src={iconFilterMobile} alt="" />
              </button>
            </div>

            <div className="hidden md:flex w-full gap-5 items-center md:justify-end">
              {categories && (
                <div className="md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center justify-center gap-2">
                  <p className="text-sm">Category</p>
                  <SelectInput
                    includeAll
                    placeholder="Select..."
                    data={categories}
                    onSelect={(value: string) => setSelectedCategory(value)}
                  />
                </div>
              )}

              <div className="md:min-w-[11rem] md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center justify-center gap-2">
                <p className="whitespace-nowrap text-sm">Sort by</p>
                <SelectInput
                  placeholder="Sort by..."
                  data={filters}
                  onSelect={(value: string) => setSelectedSortBy(value)}
                />
              </div>
            </div>

            {isCategoriesSelectOpen && categories && (
              <div className="flex md:hidden items-center justify-center gap-2">
                <SelectInput
                  includeAll
                  placeholder="Select a Category..."
                  data={categories}
                  onSelect={(value: string) => setSelectedCategory(value)}
                />
              </div>
            )}

            {isSortBySelectOpen && (
              <div className="flex md:hidden items-center justify-center gap-2">
                <SelectInput
                  placeholder="Sort by..."
                  data={filters}
                  onSelect={(value: string) => setSelectedSortBy(value)}
                />
              </div>
            )}
          </div>

          <div>
            {transactions?.map(
              (transaction: TransactionProps, index: number) => {
                return (
                  <TransactionCard
                    key={index}
                    name={
                      transaction.balance === 'income'
                        ? transaction.sender.name
                        : transaction.recipient.name
                    }
                    balance={transaction?.balance}
                    avatarUrl={
                      transaction?.balance === 'income'
                        ? transaction.sender.avatarUrl
                        : transaction.recipient.avatarUrl
                    }
                    date={format(transaction.date, 'MMM dd, yyyy')}
                    value={formatToDollar(transaction?.amount || 0)}
                  />
                )
              },
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mt-6">
            <PaginationBtn
              variant="left"
              number={0}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            <div className="flex items-center justify-center gap-3">
              {renderPaginationButtons()}
            </div>
            <PaginationBtn
              variant="right"
              number={0}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
