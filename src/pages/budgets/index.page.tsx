import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Skeleton } from '@mui/material'
import { NextSeo } from 'next-seo'
import { useAppContext } from '@/contexts/AppContext'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { LoadingPage } from '@/components/shared/LoadingPage'
import {
  BudgetItem,
  BudgetWithDetailsProps,
} from '../../components/shared/BudgetItem'
import { FinanceItem } from '../../components/shared/FinanceItem'
import Layout from '@/components/layouts/layout.page'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import useRequest from '@/utils/useRequest'
import BudgetCard from './partials/BudgetCard'
import { SkeletonBudgetCard } from '@/pages/budgets/partials/SkeletonBudgetCard'
import { BudgetModal } from './partials/BudgetModal'

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

  function getBudgetCategories(budgets: BudgetWithDetailsProps[] | undefined) {
    if (!budgets || budgets.length === 0) {
      return []
    }

    const categories = budgets.map((budget) => budget.categoryName)
    return Array.from(new Set(categories))
  }

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Budgets | Finance App"
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
          className={`px-4 md:px-10 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-8">
            <h1 className="text-gray-900 font-bold text-3xl">Budgets</h1>
            <Dialog.Root open={isBudgetModalOpen}>
              <Dialog.Trigger asChild>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className={`font-semibold rounded-md p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add Budget
                </button>
              </Dialog.Trigger>
              <BudgetModal
                onClose={() => setIsBudgetModalOpen(false)}
                existedCategories={getBudgetCategories(budgets)}
                onSubmitForm={async (): Promise<void> => {
                  await mutate()
                }}
              />
            </Dialog.Root>
          </div>

          {budgets?.length || isValidating ? (
            <div className="h-auto flex flex-col gap-6 w-full lg:grid lg:grid-cols-[1fr,1.4fr] items-start">
              <div className="w-full lg:w-auto h-auto flex-grow-0 flex flex-col md:grid md:grid-cols-[1fr,2fr] md:gap-10 lg:flex lg:flex-col lg:gap-8 bg-white px-5 py-6 rounded-md md:p-10">
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

                <div>
                  {isValidating ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col justify-start items-start w-full mt-5"
                      >
                        <span className="relative w-full rounded-full">
                          <Skeleton
                            variant="rounded"
                            width={'100%'}
                            height={20}
                          />
                        </span>
                        {index !== 4 - 1 && (
                          <span className="my-4 w-full h-[1px] bg-gray-200 text-gray-500" />
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      {budgets && budgets.length > 0 && (
                        <>
                          <div className="flex flex-col justify-start items-start w-full mt-5">
                            <h2 className="text-xl font-bold my-6 md:mt-0">
                              Spending Summary
                            </h2>
                            {budgets?.map((budget, index) => (
                              <>
                                <FinanceItem
                                  key={index}
                                  isBudgetsPage={true}
                                  title={budget.categoryName}
                                  color={budget.theme}
                                  value={budget.budgetLimit}
                                  amountSpent={budget.amountSpent}
                                />
                                {index !== budgets.length - 1 && (
                                  <span className="my-3 w-full h-[1px] bg-gray-200 text-gray-500" />
                                )}
                              </>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col w-full gap-6">
                {isValidating ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonBudgetCard key={index} />
                  ))
                ) : (
                  budgets?.map((budget) => (
                    <BudgetCard
                      key={budget.id}
                      budgetId={budget.id}
                      onSubmitForm={async (): Promise<void> => {
                        await mutate()
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="w-full bg-white px-5 py-6 rounded-md md:p-10">
              <EmptyContent
                variant={'secondary'}
                content="No budgets available."
              />
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}