import Layout from '@/components/layouts/layout.page'
import { MagnifyingGlass, X } from 'phosphor-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import useRequest from '@/utils/useRequest'
import { TransactionProps } from '@/types/transaction'
import { formatToDollar } from '@/utils/formatToDollar'
import { format } from 'date-fns'
import { PaginationBtn } from './partials/PaginationBtn'
import { CategoryProps } from '@/types/category'
import { SelectInput } from '@/components/shared/SelectInput'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { SkeletonTransactionCard } from '@/components/shared/SkeletonTransactionCard'
import iconSortMobile from '../../../public/assets/images/icon-sort-mobile.svg'
import iconFilterMobile from '../../../public/assets/images/icon-filter-mobile.svg'
import { sortByFilters } from '@/utils/constants'
import { TransactionCard } from './partials/TransactionCard'
import { calculateTotalPages } from '@/utils/calculateTotalPages'
import { useAppContext } from '@/contexts/AppContext'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { useRouter } from 'next/router'

const TransactionTable = ({
  transactions,
  isValidating,
}: {
  transactions: TransactionProps[]
  isValidating: boolean
}) => (
  <table className="min-w-full table-fixed">
    <thead>
      <tr>
        <th className="px-4 py-2 text-xs text-gray-600 text-left w-2/5">
          Recipient / Sender
        </th>
        <th className="px-4 py-2 text-xs text-gray-600 text-left w-1/5">
          Category
        </th>
        <th className="px-4 py-2 text-xs text-gray-600 text-left w-1/5">
          Transaction Date
        </th>
        <th className="px-4 py-2 text-xs text-gray-600 text-right w-1/5">
          Amount
        </th>
      </tr>
    </thead>
    <tbody>
      {isValidating ? (
        Array.from({ length: 9 }).map((_, index) => (
          <tr key={index} className="border-t">
            <td colSpan={4} className="px-4 py-2">
              <SkeletonTransactionCard />
            </td>
          </tr>
        ))
      ) : transactions && transactions.length > 0 ? (
        transactions.map((transaction) => (
          <tr key={transaction.id} className="border-t">
            <td className="px-4 py-2 text-left">
              <TransactionCard
                name={
                  transaction.balance === 'income'
                    ? transaction.sender.name
                    : transaction.recipient.name
                }
                balance={transaction.balance}
                avatarUrl={
                  transaction.balance === 'income'
                    ? transaction.sender.avatarUrl
                    : transaction.recipient.avatarUrl
                }
                date={format(transaction.date, 'MMM dd, yyyy')}
                value={formatToDollar(transaction.amount || 0)}
                category={transaction.category?.name}
              />
            </td>
            <td className="text-xs text-gray-600 px-4 py-2 text-left">
              {transaction.category?.name}
            </td>
            <td className="text-xs text-gray-600 px-4 py-2 text-left">
              {format(transaction.date, 'MMM dd, yyyy')}
            </td>
            <td className="text-xs text-gray-600 px-4 py-2 text-right">
              <span
                className={`font-bold ${
                  transaction.balance === 'income'
                    ? 'text-secondary-green'
                    : 'text-gray-900'
                }`}
              >
                {formatToDollar(transaction.amount)}
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4} className="px-4 py-2">
            <EmptyContent content="No transactions available." />
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1)

  const router = useRouter()

  const { category } = router.query

  const [search, setSearch] = useState('')

  const [selectedCategory, setSelectedCategory] = useState(
    (category as string) || 'all',
  )

  const [selectedSortBy, setSelectedSortBy] = useState('latest')

  const [isCategoriesSelectOpen, setIsCategoriesSelectOpen] = useState(false)

  const [isSortBySelectOpen, setIsSortBySelectOpen] = useState(false)

  const [maxVisibleButtons, setMaxVisibleButtons] = useState(3)

  const { isSidebarOpen } = useAppContext()

  const isRouteLoading = useLoadingOnRouteChange()

  const { data, isValidating } = useRequest<{
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
    )}&search=${search}`,
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

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <Layout>
      <div
        className={`w-full px-4 py-5 flex-grow md:p-10 lg:pl-0 pb-20 md:pb-32 lg:pb-8 ${
          isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
        }`}
      >
        <h1 className="text-gray-900 font-bold text-3xl">Transactions</h1>

        <div className="mt-8 flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
          <div className="flex flex-col md:grid md:grid-cols-[1fr,2fr] lg:flex lg:flex-row lg:justify-between w-full gap-2 pb-6 md:gap-6">
            <div className="flex justify-between gap-3 items-center gap-y-10 lg:w-full xl:max-w-[28rem]">
              <div className="h-12 text-sm truncate w-full flex items-center rounded-md border border-gray-500">
                <input
                  className="truncate w-full px-4 py-3 outline-none"
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(ev) => setSearch(ev.target.value)}
                />
                {search?.length ? (
                  <X
                    fill="bg-gray-900"
                    className="pr-4 flex w-[2.2rem] h-[2.2rem] shrink-0 cursor-pointer"
                    onClick={() => setSearch('')}
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
                className="md:hidden rounded-md bg-gray-900 p-2 flex items-center flex-shrink-0 justify-center h-[2.5rem]"
              >
                <Image width={22} src={iconSortMobile} alt="" />
              </button>

              <button
                onClick={() =>
                  setIsCategoriesSelectOpen(!isCategoriesSelectOpen)
                }
                className="md:hidden rounded-md bg-gray-900 p-2 h-[2.5rem] flex items-center justify-center flex-shrink-0"
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
                    defaultValue={(category as string) || 'all'}
                    data={categories}
                    onSelect={(value: string) => setSelectedCategory(value)}
                  />
                </div>
              )}

              <div className="md:min-w-[11rem] md:max-w-[13rem] lg:max-w-[16rem] w-full flex items-center justify-center gap-2">
                <p className="whitespace-nowrap text-sm">Sort by</p>
                <SelectInput
                  placeholder="Sort by..."
                  data={sortByFilters}
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
                  data={sortByFilters}
                  onSelect={(value: string) => setSelectedSortBy(value)}
                />
              </div>
            )}
          </div>

          <div className="hidden md:flex overflow-x-auto mt-6">
            <TransactionTable
              transactions={transactions}
              isValidating={isValidating}
            />
          </div>

          <div className="flex flex-col md:hidden">
            {isValidating ? (
              Array.from({ length: 9 }).map((_, index) => (
                <SkeletonTransactionCard key={index} />
              ))
            ) : transactions?.length ? (
              transactions.map((transaction, index) => (
                <TransactionCard
                  key={index}
                  name={
                    transaction.balance === 'income'
                      ? transaction.sender.name
                      : transaction.recipient.name
                  }
                  balance={transaction.balance}
                  avatarUrl={
                    transaction.balance === 'income'
                      ? transaction.sender.avatarUrl
                      : transaction.recipient.avatarUrl
                  }
                  date={format(transaction.date, 'MMM dd, yyyy')}
                  value={formatToDollar(transaction.amount || 0)}
                  category={transaction.category?.name}
                />
              ))
            ) : (
              <EmptyContent content="No transactions available" />
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
