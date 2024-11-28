/* eslint-disable react-hooks/exhaustive-deps */
import { FinanceCard } from './partials/FinanceCard'
import { FinanceItem } from '../../components/shared/FinanceItem'
import { TransactionCard } from '@/components/shared/TransactionCard'
import BudgetItem, {
  BudgetWithDetailsProps,
} from '../../components/shared/BudgetItem'
import HomeCard from './partials/HomeCard'
import { BillCard } from '@/pages/home/partials/BillCard'
import Layout from '@/components/layouts/layout.page'
import useRequest from '@/utils/useRequest'
import { formatToDollar } from '@/utils/formatToDollar'
import { PotProps } from '@/types/pot'
import { RecurringBillProps } from '@/types/recurringBills'
import { format } from 'date-fns'
import { TransactionProps } from '@/types/transaction'
import { useAppContext } from '@/contexts/AppContext'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

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

  const { data: balance } = useRequest<BalanceProps>({
    url: '/balance',
    method: 'GET',
  })

  const { data: allPots } = useRequest<AllPotsProps>({
    url: '/pots',
    method: 'GET',
  })

  const { data: budgets } = useRequest<BudgetWithDetailsProps[]>({
    url: '/budgets',
    method: 'GET',
  })

  const { data: recurringBills } = useRequest<RecurringBillsResult>({
    url: '/recurring_bills',
    method: 'GET',
  })

  const { data: transactions } = useRequest<TransactionProps[]>({
    url: '/transactions/latest',
    method: 'GET',
  })

  useEffect(() => {
    if (!session.data?.user) {
      router.push('/auth/login')
    }
  }, [session.data?.user])

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <Layout>
      <div
        className={`flex-grow px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
          isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
        }`}
      >
        <h1 className="text-gray-900 font-bold text-3xl">Overview</h1>

        <div className="grid md:grid-cols-3 gap-4 mt-8 md:h-[7.5rem] lg:mt-6 lg:gap-6">
          <FinanceCard
            title="Current Balance"
            value={formatToDollar(balance?.currentBalance || 0)}
          />
          <FinanceCard
            variant="secondary"
            title="Incomes"
            value={formatToDollar(balance?.incomes || 0)}
          />
          <FinanceCard
            variant="secondary"
            title="Expenses"
            value={formatToDollar(balance?.expenses || 0)}
          />
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
          <div className="flex flex-col">
            <HomeCard routePath='/pots' title="Pots" buttonLabel="See Details">
              <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
                <FinanceCard
                  icon={<img src="/assets/images/icon-pot.svg" alt="" />}
                  variant="tertiary"
                  title="Total saved"
                  value={formatToDollar(allPots?.totalCurrentAmount || 0)}
                />
                {allPots && allPots?.pots?.length ? (
                  <div className="grid grid-cols-2 gap-4">
                    {allPots?.pots?.map((pot: PotProps) => {
                      return (
                        <FinanceItem
                          key={pot.id}
                          title={pot.name}
                          value={pot.currentAmount || 0}
                          color={pot.theme.color}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <EmptyContent content="No pots available." />
                )}
              </div>
            </HomeCard>

            <HomeCard routePath='/transactions' title="Transactions" buttonLabel="View All">
              <div>
                {transactions && transactions?.length ? (
                  transactions?.map((transaction, index) => {
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
                  })
                ) : (
                  <EmptyContent content="No transactions available." />
                )}
              </div>
            </HomeCard>
          </div>

          <div className="flex flex-col flex-grow">
            <HomeCard flexGrow routePath='/budgets' title="Budgets" buttonLabel="See Details">
              {budgets && budgets.length ? (
                <div className="flex flex-grow flex-col gap-6 sm:grid sm:grid-cols-[3fr,1.1fr] sm:max-width-[30rem] sm:items-center sm:w-full lg:items-start lg:mt-[-1rem]">
                  <BudgetItem />
                  <div className="grid grid-cols-2 sm:flex sm:flex-col sm:justify-end sm:items-end sm:w-full gap-4 lg:mt-8">
                    {budgets?.map((budget, index) => {
                      return (
                        <FinanceItem
                          key={index}
                          title={budget.categoryName}
                          color={budget.theme}
                          value={budget.budgetLimit}
                        />
                      )
                    })}
                  </div>
                </div>
              ) : (
                <EmptyContent content="No budgets available." />
              )}
            </HomeCard>

            <HomeCard routePath='/recurring_bills' title="Recurring Bills" buttonLabel="See Details">
              {recurringBills ? (
                <div className="flex flex-grow flex-col sm:justify-end sm:items-end sm:w-full gap-4 pt-4">
                  <BillCard
                    title="Paid Bills"
                    value={formatToDollar(recurringBills?.paid?.total || 0)}
                    borderColor="border-l-secondary-green"
                  />
                  <BillCard
                    title="Total Upcoming"
                    value={formatToDollar(recurringBills?.upcoming?.total || 0)}
                    borderColor="border-l-secondary-yellow"
                  />
                  <BillCard
                    title="Due Soon"
                    value={formatToDollar(recurringBills?.dueSoon?.total || 0)}
                    borderColor="border-l-secondary-cyan"
                  />
                </div>
              ) : (
                <div>
                  <EmptyContent content="No recurring bills available." />
                </div>
              )}
            </HomeCard>
          </div>
        </div>
      </div>
    </Layout>
  )
}
