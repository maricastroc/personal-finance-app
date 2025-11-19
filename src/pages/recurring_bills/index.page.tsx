import { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useAppContext } from '@/contexts/AppContext'
import { RecurringBillsResult } from '../home'
import { SummaryCard } from './partials/SummaryCard'
import { MobileRecurringBillCard } from './partials/MobileRecurringBillCard'
import { SearchSection } from './partials/SearchSection'
import { TotalBillsCard } from './partials/TotalBillsCard'
import { RecurringBillsTable } from './partials/RecurringBillsTable'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import useRequest from '@/utils/useRequest'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'
import { calculateTotalPages } from '@/utils/calculateTotalPages'
import { useDebounce } from '@/utils/useDebounce'
import { SkeletonTransactionCard } from '@/components/shared/SkeletonTransactionCard'
import { LoadingPage } from '@/components/shared/LoadingPage'
import Layout from '@/components/layouts/layout.page'
import { PaginationSection } from '@/components/shared/PaginationSection/PaginationSection'
import { PageTitle } from '@/components/shared/PageTitle'

export default function RecurringBills() {
  const [currentPage, setCurrentPage] = useState(1)
  const [maxVisibleButtons, setMaxVisibleButtons] = useState(3)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedSortBy, setSelectedSortBy] = useState('latest')

  const { isSidebarOpen } = useAppContext()
  const isRouteLoading = useLoadingOnRouteChange()

  useDebounce(
    () => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    },
    500,
    [search],
  )

  const handleSetSearch = (value: string) => {
    setSearch(value)
  }

  const handleSetSelectedSortBy = (value: string) => {
    setSelectedSortBy(value)
  }

  const { data: recurringBills, isValidating } =
    useRequest<RecurringBillsResult>(
      {
        url: `/recurring_bills?page=${currentPage}&limit=10&sortBy=${formatToSnakeCase(
          selectedSortBy,
        )}&search=${debouncedSearch}`,
        method: 'GET',
      },
      {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 20000,
        focusThrottleInterval: 30000,
        keepPreviousData: true,
      },
    )

  const { data: recurringBillsResume, isValidating: isValidatingResume } =
    useRequest<RecurringBillsResult>(
      {
        url: `/recurring_bills/resume`,
        method: 'GET',
      },
      {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 20000,
        focusThrottleInterval: 30000,
        keepPreviousData: true,
      },
    )

  const pagination = recurringBills?.pagination || {
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

  if (isRouteLoading) {
    return <LoadingPage />
  }

  return (
    <>
      <NextSeo
        title="Recurring Bills | Finance App"
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
          },
        ]}
      />

      <Layout>
        <div
          role="main"
          className={`px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
          }`}
        >
          <header className="mb-8">
            <PageTitle title="Recurring Bills" />
          </header>

          <div className="flex flex-col w-full md:grid lg:grid-cols-[1fr,2fr] md:gap-6">
            <section
              aria-label="Recurring bills overview"
              className="w-full flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-6 lg:flex lg:flex-col lg:gap-6"
            >
              <TotalBillsCard recurringBills={recurringBillsResume} />

              <SummaryCard
                isValidating={isValidatingResume}
                recurringBills={recurringBillsResume}
              />
            </section>

            <section
              aria-labelledby="recurring-bills-list-title"
              className="mt-5 md:mt-0 flex flex-col bg-white rounded-lg px-5 py-6 md:p-8"
            >
              <h2 id="recurring-bills-list-title" className="sr-only">
                Recurring bills list and filters
              </h2>

              <SearchSection
                handleSetSearch={handleSetSearch}
                handleSetSelectedSortBy={handleSetSelectedSortBy}
                search={search}
              />

              <div className="hidden md:flex overflow-x-auto mt-5">
                <RecurringBillsTable
                  recurringBills={recurringBills?.allBills}
                  isValidating={isValidating}
                />
              </div>

              <div className="flex flex-col md:hidden mt-4">
                {isValidating && !recurringBills?.allBills?.length ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border-t">
                      <div className="px-4 py-2">
                        <SkeletonTransactionCard />
                      </div>
                    </div>
                  ))
                ) : recurringBills?.allBills?.length ? (
                  recurringBills.allBills.map((bill) => (
                    <MobileRecurringBillCard
                      key={bill.id}
                      recurrenceDay={bill.recurrenceDay || ''}
                      recurrenceFrequency={
                        capitalizeFirstLetter(bill.recurrenceFrequency) || ''
                      }
                      amount={bill.amount}
                      name={bill.recipient.name}
                      avatarUrl={bill.recipient.avatarUrl}
                      status={bill?.status || ''}
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No recurring bills available.
                  </p>
                )}
              </div>

              <div className="flex md:px-4 items-center justify-between gap-2 mt-6">
                <PaginationSection
                  currentPage={currentPage}
                  totalPages={totalPages}
                  maxVisibleButtons={maxVisibleButtons}
                  handleSetCurrentPage={(value: number) =>
                    setCurrentPage(value)
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </Layout>
    </>
  )
}
