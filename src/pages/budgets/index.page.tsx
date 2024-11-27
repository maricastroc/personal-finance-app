import Layout from '@/components/layouts/layout.page'
import { useAppContext } from '@/contexts/AppContext'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import { LoadingPage } from '@/components/shared/LoadingPage'
import BudgetItem, {
  BudgetWithDetailsProps,
} from '../../components/shared/BudgetItem'
import { FinanceItem } from '../../components/shared/FinanceItem'
import useRequest from '@/utils/useRequest'
import BudgetCard from './partials/BudgetCard'
import { SkeletonBudgetCard } from '@/pages/budgets/partials/SkeletonBudgetCard'
import { Skeleton } from '@mui/material'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { BudgetModalForm } from './partials/BudgetModal'

export default function Budgets() {
  const { isSidebarOpen } = useAppContext()

  const isRouteLoading = useLoadingOnRouteChange()

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

  const {
    data: budgets,
    mutate,
    isValidating,
  } = useRequest<BudgetWithDetailsProps[]>({
    url: '/budgets',
    method: 'GET',
  })

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <Layout>
      <div
        className={`px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
          isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <h1 className="text-gray-900 font-bold text-3xl">Budgets</h1>
          <Dialog.Root open={isBudgetModalOpen}>
            <Dialog.Trigger asChild>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className={`font-semibold rounded-md p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed`}
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Budget
              </button>
            </Dialog.Trigger>
            <BudgetModalForm
              onClose={() => setIsBudgetModalOpen(false)}
              onSubmitForm={async (): Promise<void> => {
                await mutate()
              }}
            />
          </Dialog.Root>
        </div>

        <div className="h-auto flex flex-col w-full lg:grid lg:grid-cols-[1fr,1.4fr] items-start">
          <div className="w-full lg:w-auto h-auto lg:mr-5 mt-8 flex-grow-0 flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
            <div className="w-[90%] mx-auto">
              {isValidating ? (
                <span className="relative w-full mx-auto rounded-full">
                  <Skeleton
                    variant="circular"
                    width={250}
                    height={250}
                    style={{ margin: 'auto' }}
                  />
                </span>
              ) : (
                <BudgetItem isBudgetsScreen />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold mt-6">Spending Summary</h2>
              <div className="flex flex-col justify-end items-end w-full mt-5">
                {isValidating
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <>
                        <span className="relative w-full rounded-full">
                          <Skeleton
                            key={index}
                            variant="rounded"
                            width={'100%'}
                            height={20}
                          />
                        </span>
                        {index !== 4 - 1 && (
                          <span className="my-4 w-full h-[1px] bg-gray-200 text-gray-500" />
                        )}
                      </>
                    ))
                  : budgets?.map((budget, index) => {
                      return (
                        <>
                          <FinanceItem
                            isBudgetsPage={true}
                            key={index}
                            title={budget.categoryName}
                            color={budget.theme}
                            value={budget.budgetLimit}
                            amountSpent={budget.amountSpent}
                          />
                          {index !== budgets.length - 1 && (
                            <span className="my-4 w-full h-[1px] bg-gray-200 text-gray-500" />
                          )}
                        </>
                      )
                    })}
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full">
            {isValidating
              ? Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonBudgetCard key={index} />
                ))
              : budgets?.map((budget, index) => {
                  return (
                    <BudgetCard
                      key={index}
                      budgetId={budget.id}
                      onSubmitForm={async (): Promise<void> => {
                        await mutate()
                      }}
                    />
                  )
                })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
