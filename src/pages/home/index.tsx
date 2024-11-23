import { FinanceCard } from '@/components/shared/FinanceCard'
import { PotItem } from '@/components/shared/PotItem'
import { TransactionCard } from '@/components/shared/TransactionCard'
import EmmaAvatarUrl from '../../../public/assets/images/avatars/emma-richardson.jpg'
import DanielAvatarUrl from '../../../public/assets/images/avatars/daniel-carter.jpg'
import EllaAvatarUrl from '../../../public/assets/images/avatars/ella-phillips.jpg'
import HarperAvatarUrl from '../../../public/assets/images/avatars/harper-edwards.jpg'
import FlavorAvatarUrl from '../../../public/assets/images/avatars/flavor-fiesta.jpg'
import BudgetItem from '@/components/shared/BudgetItem'
import HomeCard from '@/components/shared/HomeCard'
import { BillCard } from '@/components/shared/BillCard'
import Layout from '@/components/layouts/layout.page'
import { useState } from 'react'
import { Sidebar } from '@/components/shared/Sidebar'

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <Layout>
      <div>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          handleIsSidebarOpen={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex-grow px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pl-[17rem] lg:pb-8">
          <h1 className="text-gray-900 font-bold text-3xl">Overview</h1>

          <div className="grid md:grid-cols-3 gap-4 mt-8 md:h-[7.5rem] lg:mt-6 lg:gap-6">
            <FinanceCard title="Current Balance" value="$4,836.00" />
            <FinanceCard variant="secondary" title="Income" value="$3,814.25" />
            <FinanceCard
              variant="secondary"
              title="Expeses"
              value="$1,700.50"
            />
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
            <div className="flex flex-col">
              <HomeCard title="Pots" buttonLabel="See Details">
                <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
                  <FinanceCard
                    icon={<img src="/assets/images/icon-pot.svg" alt="" />}
                    variant="tertiary"
                    title="Expeses"
                    value="$1,700.50"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <PotItem
                      title="Savings"
                      value="$159.00"
                      color="bg-secondary-green"
                    />
                    <PotItem
                      title="Concert Ticket"
                      value="$110.00"
                      color="bg-secondary-navy"
                    />
                    <PotItem
                      title="Gift"
                      value="$110.00"
                      color="bg-secondary-cyan"
                    />
                    <PotItem
                      title="New Laptop"
                      value="$10.00"
                      color="bg-secondary-yellow"
                    />
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
                    <PotItem
                      title="Entertainment"
                      value="$50.00"
                      color="bg-secondary-green"
                    />
                    <PotItem
                      title="Bills"
                      value="$750.00"
                      color="bg-secondary-navy"
                    />
                    <PotItem
                      title="Dining Out"
                      value="$75.00"
                      color="bg-secondary-cyan"
                    />
                    <PotItem
                      title="Personal Care"
                      value="$100.00"
                      color="bg-secondary-yellow"
                    />
                  </div>
                </div>
              </HomeCard>

              <HomeCard title="Recurring Bills" buttonLabel="See Details">
                <div className="flex flex-grow flex-col sm:justify-end sm:items-end sm:w-full gap-4 pt-4">
                  <BillCard
                    title="Paid Bills"
                    value="$190.00"
                    borderColor="border-l-secondary-green"
                  />
                  <BillCard
                    title="Total Upcoming"
                    value="$194.98"
                    borderColor="border-l-secondary-yellow"
                  />
                  <BillCard
                    title="Due Soon"
                    value="$59.98"
                    borderColor="border-l-secondary-cyan"
                  />
                </div>
              </HomeCard>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
