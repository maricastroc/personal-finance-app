import Layout from '@/components/layouts/layout.page'
import { useEffect, useState } from 'react'
import useRequest from '@/utils/useRequest'
import { TransactionProps } from '@/types/transaction'
import { formatToDollar } from '@/utils/formatToDollar'
import { format } from 'date-fns'
import { CategoryProps } from '@/types/category'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { SkeletonTransactionCard } from '@/components/shared/SkeletonTransactionCard'
import { TransactionCard } from './partials/TransactionCard'
import { calculateTotalPages } from '@/utils/calculateTotalPages'
import { useAppContext } from '@/contexts/AppContext'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { useRouter } from 'next/router'
import { PaginationSection } from '@/components/shared/PaginationSection/PaginationSection'
import { SearchSection } from './partials/SearchSection'
import { TransactionTable } from './partials/TransactionsTable'

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1)

  const router = useRouter()

  const { category } = router.query

  const [search, setSearch] = useState('')

  const [selectedCategory, setSelectedCategory] = useState(
    (category as string) || 'all',
  )

  const [selectedSortBy, setSelectedSortBy] = useState('latest')

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
          {categories && (
            <SearchSection
              categories={categories}
              category={category as string}
              search={search}
              handleSetSortBy={(value: string) => setSelectedSortBy(value)}
              handleSetSearch={(value: string) => setSearch(value)}
              handleSetCategory={(value: string) => setSelectedCategory(value)}
            />
          )}

          <TransactionTable
            transactions={transactions}
            isValidating={isValidating}
          />

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
            <PaginationSection
              currentPage={currentPage}
              maxVisibleButtons={maxVisibleButtons}
              totalPages={totalPages}
              handleSetCurrentPage={(value: number) => setCurrentPage(value)}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
