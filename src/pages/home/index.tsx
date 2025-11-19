/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { useAppContext } from '@/contexts/AppContext'
import Layout from '@/components/layouts/layout.page'
import { BudgetWithDetailsProps } from '@/components/shared/BudgetItem'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { FinanceCard } from './partials/FinanceCard'
import { PotProps } from '@/types/pot'
import { TransactionProps } from '@/types/transaction'
import { RecurringBillProps } from '@/types/recurringBills'
import useRequest from '@/utils/useRequest'
import { formatToDollar } from '@/utils/formatToDollar'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { BudgetsSection } from './partials/BudgetsSection'
import { RecurringBillsSection } from './partials/RecurringBillsSection'
import { TransactionsSection } from './partials/TransactionsSection'
import { PotsSection } from './partials/PotsSection'
import { PageHeader } from './partials/PageHeader'

interface BalanceProps {
  incomes: number | undefined
  expenses: number | undefined
  currentBalance: number | undefined
}

export interface AllPotsProps {
  pots: PotProps[]
  totalCurrentAmount: number | undefined
}

interface RecurringBillsWithDetails {
  bills: RecurringBillProps[]
  total: number
}

export interface RecurringBillsResult {
  paid: RecurringBillsWithDetails
  upcoming: RecurringBillsWithDetails
  dueSoon: RecurringBillsWithDetails
  allBills: RecurringBillProps[]
  monthlyTotal: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function Home() {
  const { isSidebarOpen } = useAppContext()

  const session = useSession()

  const router = useRouter()

  const isRouteLoading = useLoadingOnRouteChange()

  const { data: balance, isValidating: isValidatingBalance } =
    useRequest<BalanceProps>(
      { url: '/balance', method: 'GET' },
      {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 20000,
        focusThrottleInterval: 30000,
        keepPreviousData: true,
      },
    )

  const { data: allPots, isValidating: isValidatingPots } =
    useRequest<AllPotsProps>(
      { url: '/pots', method: 'GET' },
      {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 20000,
        focusThrottleInterval: 30000,
        keepPreviousData: true,
      },
    )

  const { data: budgets, isValidating: isValidatingBudgets } = useRequest<
    BudgetWithDetailsProps[]
  >(
    { url: '/budgets', method: 'GET' },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      dedupingInterval: 20000,
      focusThrottleInterval: 30000,
      keepPreviousData: true,
    },
  )

  const { data: recurringBills, isValidating: isValidatingBills } =
    useRequest<RecurringBillsResult>(
      { url: '/recurring_bills', method: 'GET' },
      {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 20000,
        focusThrottleInterval: 30000,
        keepPreviousData: true,
      },
    )

  const { data: transactions, isValidating: isValidatingTransactions } =
    useRequest<TransactionProps[]>(
      { url: '/transactions/latest', method: 'GET' },
      {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 20000,
        focusThrottleInterval: 30000,
        keepPreviousData: true,
      },
    )

  const isValidating =
    isValidatingBalance ||
    isValidatingTransactions ||
    isValidatingPots ||
    isValidatingBudgets ||
    isValidatingBills

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [session.status])

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Home | Finance App"
        additionalMetaTags={[
          {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
          },
        ]}
      />

      <Layout>
        <div
          className={`flex-grow px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
          }`}
        >
          <PageHeader />

          <section className="grid md:grid-cols-3 gap-4 mt-8 md:h-[7.5rem] lg:mt-6 lg:gap-6">
            <FinanceCard
              title="Current Balance"
              value={formatToDollar(balance?.currentBalance || 0)}
              isValidating={isValidating}
            />
            <FinanceCard
              variant="secondary"
              title="Incomes"
              value={formatToDollar(balance?.incomes || 0)}
              isValidating={isValidating}
            />
            <FinanceCard
              variant="secondary"
              title="Expenses"
              value={formatToDollar(balance?.expenses || 0)}
              isValidating={isValidating}
            />
          </section>

          <section className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col">
              <PotsSection allPots={allPots} isValidating={isValidating} />
              <TransactionsSection
                transactions={transactions}
                isValidating={isValidating}
              />
            </div>

            <div className="flex flex-col flex-grow">
              <BudgetsSection budgets={budgets} isValidating={isValidating} />
              <RecurringBillsSection
                recurringBills={recurringBills}
                isValidating={isValidating}
              />
            </div>
          </section>
        </div>
      </Layout>
    </>
  )
}
