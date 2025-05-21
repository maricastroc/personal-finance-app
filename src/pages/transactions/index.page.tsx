import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { TransactionProps } from '@/types/transaction'
import { CategoryProps } from '@/types/category'
import { useAppContext } from '@/contexts/AppContext'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { SkeletonTransactionCard } from '@/components/shared/SkeletonTransactionCard'
import Layout from '@/components/layouts/layout.page'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { PaginationSection } from '@/components/shared/PaginationSection/PaginationSection'
import { SearchSection } from './partials/SearchSection'
import { TransactionTable } from './partials/TransactionsTable'
import { TransferModalForm } from './partials/TransferModal'
import { TransactionCard } from './partials/TransactionCard'
import useRequest from '@/utils/useRequest'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { formatToDollar } from '@/utils/formatToDollar'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { calculateTotalPages } from '@/utils/calculateTotalPages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import * as Dialog from '@radix-ui/react-dialog'
import { format } from 'date-fns'
import { useDebounce } from '@/utils/useDebounce'

export default function Transactions() {
  const [currentPage, setCurrentPage] = useState(1)

  const router = useRouter()

  const { category } = router.query

  const [search, setSearch] = useState('')

  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [selectedCategory, setSelectedCategory] = useState(
    (category as string) || 'all',
  )

  const [selectedSortBy, setSelectedSortBy] = useState('latest')

  const [maxVisibleButtons, setMaxVisibleButtons] = useState(3)

  const { isSidebarOpen } = useAppContext()

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  const isRouteLoading = useLoadingOnRouteChange()

  useDebounce(
    () => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    },
    500,
    [search],
  )

  const { data, isValidating, mutate } = useRequest<{
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
    )}&search=${debouncedSearch}`,
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

  const handleSetCategory = useCallback((value: string) => {
    setSelectedCategory(value)
    setCurrentPage(1)
  }, [])

  const handleSetSortBy = useCallback((value: string) => {
    setSelectedSortBy(value)
    setCurrentPage(1)
  }, [])

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Transactions | Finance App"
        additionalMetaTags={[
          {
            name: 'viewport',
            content:
              'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
          },
        ]}
      />
      <Layout>
        <div
          className={`w-full px-4 py-5 flex-grow md:p-10 lg:pl-0 pb-20 md:pb-32 lg:pb-8 ${
            isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <h1 className="text-gray-900 font-bold text-3xl">Transactions</h1>
            <Dialog.Root open={isTransferModalOpen}>
              <Dialog.Trigger asChild>
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  className={`font-semibold rounded-md p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed`}
                >
                  <FontAwesomeIcon icon={faPlus} className="max-sm:hidden" />
                  Transfer
                </button>
              </Dialog.Trigger>
              {categories && (
                <TransferModalForm
                  onSubmitForm={async (): Promise<void> => {
                    await mutate()
                  }}
                  categories={categories}
                  onClose={() => setIsTransferModalOpen(false)}
                />
              )}
            </Dialog.Root>
          </div>

          <div className="mt-8 flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
            {categories && (
              <SearchSection
                categories={categories}
                category={category as string}
                search={search}
                handleSetSortBy={handleSetSortBy}
                handleSetSearch={setSearch}
                handleSetCategory={handleSetCategory}
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
                handleSetCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
