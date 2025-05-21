/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { NextSeo } from 'next-seo'
import { format } from 'date-fns'
import { useAppContext } from '@/contexts/AppContext'
import Layout from '@/components/layouts/layout.page'
import { TransactionCard } from '@/components/shared/TransactionCard'
import {
  BudgetWithDetailsProps,
  BudgetItem,
} from '@/components/shared/BudgetItem'
import { FinanceItem } from '@/components/shared/FinanceItem'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { BillCard } from '@/pages/home/partials/BillCard'
import HomeCard from './partials/HomeCard'
import { FinanceCard } from './partials/FinanceCard'
import { PotProps } from '@/types/pot'
import { TransactionProps } from '@/types/transaction'
import { RecurringBillProps } from '@/types/recurringBills'
import useRequest from '@/utils/useRequest'
import { formatToDollar } from '@/utils/formatToDollar'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'
import { SkeletonPot } from '@/components/skeletons/SkeletonPot'
import { SkeletonBudgetSection } from '@/components/skeletons/SkeletonBudgetSection'
import { SkeletonRecurringBillsSection } from '@/components/skeletons/SkeletonRecurringBillsSection'
import { SkeletonTransactionsSection } from '@/components/skeletons/SkeletonTransactionsSection'

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

  const isDemoUser =
    session?.data?.user.email === process.env.NEXT_PUBLIC_DEMO_LOGIN

  const { data: balance, isValidating: isValidatingBalance } =
    useRequest<BalanceProps>({
      url: '/balance',
      method: 'GET',
    })

  const { data: allPots, isValidating: isValidatingPots } =
    useRequest<AllPotsProps>({
      url: '/pots',
      method: 'GET',
    })

  const { data: budgets, isValidating: isValidatingBudgets } = useRequest<
    BudgetWithDetailsProps[]
  >({
    url: '/budgets',
    method: 'GET',
  })

  const { data: recurringBills, isValidating: isValidatingBills } =
    useRequest<RecurringBillsResult>({
      url: '/recurring_bills',
      method: 'GET',
    })

  const { data: transactions, isValidating: isValidatingTransactions } =
    useRequest<TransactionProps[]>({
      url: '/transactions/latest',
      method: 'GET',
    })

  const isValidating =
    isValidatingBalance ||
    isValidatingTransactions ||
    isValidatingPots ||
    isValidatingBudgets ||
    isValidatingBills

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' })
    toast?.success('See you soon!')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!session.data?.user) {
        router.push('/auth/login')
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [session.data?.user])

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Home | Finance App"
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
          className={`flex-grow px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-8">
            <h1 className="text-gray(-900 font-bold text-3xl">Overview</h1>
            <button
              onClick={() => handleLogout()}
              className={`font-semibold rounded-md p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed`}
            >
              {isDemoUser ? (
                <FontAwesomeIcon icon={faRightToBracket} />
              ) : (
                <FontAwesomeIcon icon={faRightToBracket} />
              )}
              {isDemoUser ? 'Login' : 'Logout'}
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-8 md:h-[7.5rem] lg:mt-6 lg:gap-6">
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
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col">
              <HomeCard
                routePath="/pots"
                title="Pots"
                buttonLabel="See Details"
              >
                <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
                  {isValidating ? (
                    <SkeletonPot />
                  ) : allPots ? (
                    <>
                      <FinanceCard
                        icon={<img src="/assets/images/icon-pot.svg" alt="" />}
                        variant="tertiary"
                        title="Total saved"
                        value={formatToDollar(allPots.totalCurrentAmount || 0)}
                      />
                      {allPots.pots?.length ? (
                        <div className="grid grid-cols-2 gap-4">
                          {allPots.pots.map((pot: PotProps) => (
                            <FinanceItem
                              key={pot.id}
                              title={pot.name}
                              value={pot.currentAmount || 0}
                              color={pot.theme.color}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyContent content="No pots available." />
                      )}
                    </>
                  ) : (
                    <EmptyContent content="No pots available." />
                  )}
                </div>
              </HomeCard>

              <HomeCard
                routePath="/transactions"
                title="Transactions"
                buttonLabel="View All"
              >
                {isValidating ? (
                  <SkeletonTransactionsSection />
                ) : (
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
                )}
              </HomeCard>
            </div>

            <div className="flex flex-col flex-grow">
              <HomeCard
                flexGrow
                routePath="/budgets"
                title="Budgets"
                buttonLabel="See Details"
              >
                {isValidating ? (
                  <SkeletonBudgetSection />
                ) : budgets && budgets.length ? (
                  <div className="flex flex-grow flex-col gap-6 sm:grid sm:grid-cols-[3fr,1.1fr] sm:max-width-[30rem] sm:items-center sm:w-full lg:items-start lg:mt-[-1rem]">
                    <BudgetItem />
                    <div className="grid grid-cols-2 sm:flex sm:flex-col sm:justify-end sm:items-end sm:w-full gap-4 lg:mt-8">
                      {budgets.map((budget, index) => (
                        <FinanceItem
                          key={index}
                          title={budget.categoryName}
                          color={budget.theme}
                          value={budget.budgetLimit}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyContent content="No budgets available." />
                )}
              </HomeCard>

              <HomeCard
                routePath="/recurring_bills"
                title="Recurring Bills"
                buttonLabel="See Details"
              >
                {isValidating ? (
                  <SkeletonRecurringBillsSection />
                ) : recurringBills ? (
                  <div className="flex flex-grow flex-col sm:justify-end sm:items-end sm:w-full gap-4 pt-4">
                    <BillCard
                      title="Paid Bills"
                      value={formatToDollar(recurringBills.paid?.total || 0)}
                      borderColor="border-l-secondary-green"
                    />
                    <BillCard
                      title="Total Upcoming"
                      value={formatToDollar(
                        recurringBills.upcoming?.total || 0,
                      )}
                      borderColor="border-l-secondary-yellow"
                    />
                    <BillCard
                      title="Due Soon"
                      value={formatToDollar(recurringBills.dueSoon?.total || 0)}
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
    </>
  )
}
