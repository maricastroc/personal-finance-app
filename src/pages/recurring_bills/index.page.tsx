import { useEffect, useState } from 'react'
import { useAppContext } from '@/contexts/AppContext'
import { RecurringBillsResult } from '../home'
import { SummaryCard } from './partials/SummaryCard'
import { MobileRecurringBillCard } from './partials/MobileRecurringBillCard'
import { LoadingPage } from '@/components/shared/LoadingPage'
import Layout from '@/components/layouts/layout.page'
import { SearchSection } from './partials/SearchSection'
import { TotalBillsCard } from './partials/TotalBillsCard'
import { RecurringBillsTable } from './partials/RecurringBillsTable'
import { formatToSnakeCase } from '@/utils/formatToSnakeCase'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import useRequest from '@/utils/useRequest'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'
import { calculateTotalPages } from '@/utils/calculateTotalPages'
import { PaginationSection } from '@/components/shared/PaginationSection/PaginationSection'
import { NextSeo } from 'next-seo'

export default function RecurringBills() {
  const [currentPage, setCurrentPage] = useState(1)

  const [maxVisibleButtons, setMaxVisibleButtons] = useState(3)

  const { isSidebarOpen } = useAppContext()

  const [search, setSearch] = useState('')

  const isRouteLoading = useLoadingOnRouteChange()

  const [selectedSortBy, setSelectedSortBy] = useState('latest')

  const handleSetSearch = (value: string) => {
    setSearch(value)
  }

  const handleSetSelectedSortBy = (value: string) => {
    setSelectedSortBy(value)
  }

  const { data: recurringBills, isValidating } =
    useRequest<RecurringBillsResult>({
      url: `/recurring_bills?page=${currentPage}&limit=10&sortBy=${formatToSnakeCase(
        selectedSortBy,
      )}&search=${search}`,
      method: 'GET',
    })

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

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo title="Recurring Bills | Finance App" />
      <Layout>
        <div
          className={`px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
          }`}
        >
          <h1 className="text-gray-900 mb-10 font-bold text-3xl">
            Recurring Bills
          </h1>

          <div className="flex flex-col w-full md:grid lg:grid-cols-[1fr,2fr] md:gap-6">
            <div className="w-full flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-6 lg:flex lg:flex-col lg:gap-6">
              <TotalBillsCard />
              <SummaryCard />
            </div>

            <div className="mt-5 md:mt-0 flex flex-col bg-white rounded-lg px-5 py-6 md:p-8">
              <SearchSection
                handleSetSearch={handleSetSearch}
                handleSetSelectedSortBy={handleSetSelectedSortBy}
                search={search}
              />

              <div className="hidden md:flex overflow-x-auto mt-5">
                {recurringBills && (
                  <RecurringBillsTable
                    recurringBills={recurringBills?.allBills}
                    isValidating={isValidating}
                  />
                )}
              </div>

              <div className="flex flex-col md:hidden">
                {recurringBills?.allBills.map((bill) => {
                  return (
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
                  )
                })}
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
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
