import { FinanceCard } from '@/components/shared/FinanceCard'
import { FinanceItem } from '@/components/shared/FinanceItem'
import { TransactionCard } from '@/components/shared/TransactionCard'
import EmmaAvatarUrl from '../../../public/assets/images/avatars/emma-richardson.jpg'
import DanielAvatarUrl from '../../../public/assets/images/avatars/daniel-carter.jpg'
import EllaAvatarUrl from '../../../public/assets/images/avatars/ella-phillips.jpg'
import HarperAvatarUrl from '../../../public/assets/images/avatars/harper-edwards.jpg'
import FlavorAvatarUrl from '../../../public/assets/images/avatars/flavor-fiesta.jpg'
import BudgetItem, {
  BudgetWithDetailsProps,
} from '@/components/shared/BudgetItem'
import HomeCard from '@/components/shared/HomeCard'
import { BillCard } from '@/components/shared/BillCard'
import Layout from '@/components/layouts/layout.page'
import { useAppContext } from '@/contexts/AppContext'
import useRequest from '@/utils/useRequest'
import { formatToDollar } from '@/utils/formatToDollar'
import { PotProps } from '@/types/pot'
import { RecurringBillProps } from '@/types/recurringBills'

interface BalanceProps {
  incomes: number | undefined
  expenses: number | undefined
  currentBalance: number | undefined
}

interface AllPotsProps {
  pots: PotProps[]
  totalCurrentAmount: number | undefined
}

interface RecurringBillsWithDetails {
  bills: RecurringBillProps[]
  total: number
}

interface RecurringBillsResult {
  paid: RecurringBillsWithDetails
  upcoming: RecurringBillsWithDetails
  dueSoon: RecurringBillsWithDetails
}

export default function Home() {
  const { isSidebarOpen } = useAppContext()

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
  console.log(recurringBills)
  return (
    <Layout>
      <div
        className={`flex-grow px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 ${
          isSidebarOpen ? 'lg:pl-[17rem]' : 'lg:pl-[7.5rem]'
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
            <HomeCard title="Pots" buttonLabel="See Details">
              <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
                <FinanceCard
                  icon={<img src="/assets/images/icon-pot.svg" alt="" />}
                  variant="tertiary"
                  title="Total saved"
                  value={formatToDollar(allPots?.totalCurrentAmount || 0)}
                />
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
              </div>
            </HomeCard>

            <HomeCard title="Transactions" buttonLabel="View All">
              <div>
                <TransactionCard
                  name="Emma Richardson"
                  value="$75.50"
                  balance="positive"
                  date="Aug 19, 2024"
                  avatarUrl={EmmaAvatarUrl}
                />
                <TransactionCard
                  name="Daniel Carter"
                  value="$55.50"
                  balance="negative"
                  date="Aug 19, 2024"
                  avatarUrl={DanielAvatarUrl}
                />
                <TransactionCard
                  name="Ella Philips"
                  value="$42.30"
                  balance="negative"
                  date="Aug 18, 2024"
                  avatarUrl={EllaAvatarUrl}
                />
                <TransactionCard
                  name="Harper Edwards"
                  value="$120.00"
                  balance="positive"
                  date="Aug 17, 2024"
                  avatarUrl={HarperAvatarUrl}
                />
                <TransactionCard
                  name="Flavor Fiesta"
                  value="$65.00"
                  balance="positive"
                  date="Aug 17, 2024"
                  avatarUrl={FlavorAvatarUrl}
                />
              </div>
            </HomeCard>
          </div>

          <div className="flex flex-col flex-grow">
            <HomeCard flexGrow title="Budgets" buttonLabel="See Details">
              <div className="flex flex-grow flex-col gap-6 sm:grid sm:grid-cols-[3fr,1.1fr] sm:max-width-[30rem] sm:items-center sm:w-full lg:items-start lg:mt-[-1rem]">
                <BudgetItem />
                <div className="grid grid-cols-2 sm:flex sm:flex-col sm:justify-end sm:items-end sm:w-full gap-4">
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
            </HomeCard>

            <HomeCard title="Recurring Bills" buttonLabel="See Details">
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
            </HomeCard>
          </div>
        </div>
      </div>
    </Layout>
  )
}
