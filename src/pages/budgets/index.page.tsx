import { useState } from 'react'
import { Skeleton } from '@mui/material'
import { NextSeo } from 'next-seo'
import { useAppContext } from '@/contexts/AppContext'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { LoadingPage } from '@/components/shared/LoadingPage'
import {
  BudgetItem,
  BudgetWithDetailsProps,
} from '@/components/shared/BudgetItem'
import Layout from '@/components/layouts/layout.page'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'
import useRequest from '@/utils/useRequest'
import { SkeletonBudgetCard } from './partials/SkeletonBudgetCard'
import BudgetCard from './BudgetCard'
import { PageHeader } from './partials/PageHeader'
import { SkeletonSection } from './partials/SkeletonSection'
import { BudgetsList } from './partials/BudgetsList'

export default function Budgets() {
  const { isSidebarOpen } = useAppContext()

  const isRouteLoading = useLoadingOnRouteChange()

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)

  const {
    data: budgets,
    mutate,
    isValidating,
  } = useRequest<BudgetWithDetailsProps[]>(
    {
      url: '/budgets',
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
        <main
          role="main"
          className={`px-4 md:px-10 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
          }`}
        >
          <PageHeader
            budgets={budgets}
            mutate={mutate}
            setIsBudgetModalOpen={setIsBudgetModalOpen}
            isBudgetModalOpen={isBudgetModalOpen}
          />

          {budgets?.length || isValidating ? (
            <div className="h-auto flex flex-col gap-6 w-full lg:grid lg:grid-cols-[1fr,1.4fr] items-start">
              <section
                aria-labelledby="spending-summary-title"
                className="w-full lg:w-auto h-auto flex-grow-0 flex flex-col md:grid md:grid-cols-[1fr,2fr] md:gap-10 lg:flex lg:flex-col lg:gap-8 bg-white px-5 py-6 rounded-md md:p-10"
              >
                {isValidating ? (
                  <span
                    className="relative w-full mx-auto rounded-full"
                    aria-busy="true"
                  >
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

                <div className="mt-6">
                  {isValidating ? (
                    <SkeletonSection />
                  ) : (
                    budgets &&
                    budgets.length > 0 && <BudgetsList budgets={budgets} />
                  )}
                </div>
              </section>

              <section
                aria-label="Budget Cards List"
                className="flex flex-col w-full gap-6"
              >
                {isValidating
                  ? Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonBudgetCard key={index} />
                    ))
                  : budgets?.map((budget) => (
                      <BudgetCard
                        key={budget.id}
                        budgetId={budget.id}
                        onSubmitForm={async () => {
                          await mutate()
                        }}
                      />
                    ))}
              </section>
            </div>
          ) : (
            <section className="w-full bg-white px-5 py-6 rounded-md md:p-10">
              <EmptyContent
                variant="secondary"
                content="No budgets available."
              />
            </section>
          )}
        </main>
      </Layout>
    </>
  )
}
