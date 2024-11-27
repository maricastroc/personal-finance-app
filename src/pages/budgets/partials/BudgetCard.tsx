import { TransactionCard } from '@/components/shared/TransactionCard'
import { BudgetProps } from '@/types/budget'
import { TransactionProps } from '@/types/transaction'
import { formatToDollar } from '@/utils/formatToDollar'
import useRequest from '@/utils/useRequest'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format } from 'date-fns'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { BudgetModalForm } from '../partials/BudgetModal'
import { useRouter } from 'next/router'
import { DeleteBudgetModal } from './DeleteBudgetModal'

interface DetailsProps {
  categoryName: string
  amountSpent: number
  theme: string
  budgetLimit: number
  percentageSpent: number
}

interface BudgetWithDetailsProps {
  budget: BudgetProps
  budgetDetails: DetailsProps
  transactions: TransactionProps[]
}

interface BudgetCardProps {
  budgetId: string
  onSubmitForm: () => Promise<void>
}

export default function BudgetCard({
  budgetId,
  onSubmitForm,
}: BudgetCardProps) {
  const [isBudgetDropdownOpen, setIsBudgetDropdownOpen] = useState(false)

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

  const [isDeleteBudgetModalOpen, setIsDeleteBudgetModalOpen] = useState(false)

  const router = useRouter()

  const { data: budget, mutate } = useRequest<BudgetWithDetailsProps>({
    url: `/budgets/${budgetId}`,
    method: 'GET',
  })

  const freeQuantity =
    (budget?.budgetDetails.budgetLimit || 0) -
    (budget?.budgetDetails.amountSpent || 0)

  const handleSeeAllClick = () => {
    router.push({
      pathname: '/transactions',
      query: { category: budget?.budgetDetails.categoryName },
    })
  }

  return (
    <div className="mt-8 flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span
            className="w-[16px] h-[16px] rounded-full"
            style={{ backgroundColor: budget?.budgetDetails.theme }}
          />
          <h2 className="text-xl font-bold">
            {budget?.budgetDetails.categoryName}
          </h2>
        </div>
        <div className="flex flex-col gap-2 items-end justify-end relative">
          <FontAwesomeIcon
            onClick={() => setIsBudgetDropdownOpen(!isBudgetDropdownOpen)}
            className="text-gray-500 relative cursor-pointer"
            icon={faEllipsis}
          />
          {isBudgetDropdownOpen && (
            <div className="absolute top-[1.5rem] w-[7rem] gap-1 flex flex-col bg-white shadow-xl p-3 rounded-lg items-start text-start">
              <Dialog.Root open={isBudgetModalOpen}>
                <Dialog.Trigger asChild>
                  <button
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="cursor-pointer hover:text-gray-500 text-sm text-gray-800 font-bold"
                  >
                    Edit
                  </button>
                </Dialog.Trigger>
                {budget?.budgetDetails && (
                  <BudgetModalForm
                    isEdit
                    onSubmitForm={async () => {
                      await mutate()
                      await onSubmitForm()
                      setIsBudgetDropdownOpen(false)
                    }}
                    budgetId={budgetId}
                    categoryName={budget?.budgetDetails.categoryName}
                    budgetLimit={budget?.budgetDetails.budgetLimit}
                    theme={budget?.budgetDetails.theme}
                    onClose={() => {
                      setIsBudgetModalOpen(false)
                      setIsBudgetDropdownOpen(false)
                    }}
                  />
                )}
              </Dialog.Root>
              <span className="my-1 w-full h-[1px] bg-gray-200 text-gray-500" />
              <Dialog.Root open={isDeleteBudgetModalOpen}>
                <Dialog.Trigger asChild>
                  <button
                    onClick={() => setIsDeleteBudgetModalOpen(true)}
                    className="cursor-pointer hover:brightness-150 text-sm text-secondary-red font-bold"
                  >
                    Delete
                  </button>
                </Dialog.Trigger>
                {budget && (
                  <DeleteBudgetModal
                    onSubmitForm={async () => {
                      await mutate()
                      await onSubmitForm()
                      setIsBudgetDropdownOpen(false)
                    }}
                    onClose={() => {
                      setIsDeleteBudgetModalOpen(false)
                      setIsBudgetDropdownOpen(false)
                    }}
                    budget={budget.budget}
                  />
                )}
              </Dialog.Root>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 pt-6">
        Maximum of {formatToDollar(budget?.budgetDetails.budgetLimit || 0)}
      </p>

      <div className="mt-4 w-full h-[2rem] p-1 bg-beige-100 rounded-full">
        <div
          className="h-full rounded-lg"
          style={{
            width: `${
              (budget?.budgetDetails?.percentageSpent || 0) > 100
                ? '100'
                : budget?.budgetDetails.percentageSpent
            }%`,
            backgroundColor: budget?.budgetDetails.theme,
          }}
        />
      </div>

      <div className="flex items-center mt-4">
        <div className={`flex items-center w-full`}>
          <span className={`w-1 rounded-md mr-3 h-10 bg-secondary-green`} />
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">Spent</p>
            <h2 className="font-bold text-sm">
              {formatToDollar(budget?.budgetDetails.amountSpent || 0)}
            </h2>
          </div>
        </div>

        <div className={`flex items-center w-full`}>
          <span className={`w-1 rounded-md mr-3 h-10 bg-beige-100`} />
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-500">Free</p>
            <h2 className="font-bold text-sm">
              {formatToDollar(freeQuantity)}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-beige-100 p-4 rounded-lg md:p-6">
        <div className="w-full flex items-center justify-between">
          <h2 className="font-bold text-base">Latest Spending</h2>
          <button className="flex items-center gap-2">
            <p className="text-sm text-gray-500" onClick={handleSeeAllClick}>
              See All
            </p>
            <div className="relative h-3 w-3">
              <img src="/assets/images/icon-caret-right.svg" alt="" />
            </div>
          </button>
        </div>

        <div className="flex w-full flex-col mt-6">
          {budget?.transactions.map((transaction, index) => {
            return (
              <>
                <TransactionCard
                  isBudgetsScreen
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
                {index !== budget?.transactions?.length - 1 && (
                  <span className="my-1 w-full h-[1px] bg-gray-200 text-gray-500" />
                )}
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}
