import { useState } from 'react'
import { NextSeo } from 'next-seo'
import * as Dialog from '@radix-ui/react-dialog'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '@/contexts/AppContext'
import Layout from '@/components/layouts/layout.page'
import { EmptyContent } from '@/components/shared/EmptyContent'
import { LoadingPage } from '@/components/shared/LoadingPage'
import { PotCard } from './partials/PotCard'
import { PotModalForm } from './partials/PotModal'
import { SkeletonPotCard } from './partials/SkeletonPotCard'
import { AllPotsProps } from '../home'
import useRequest from '@/utils/useRequest'
import { useLoadingOnRouteChange } from '@/utils/useLoadingOnRouteChange'

export default function Pots() {
  const { isSidebarOpen } = useAppContext()

  const isRouteLoading = useLoadingOnRouteChange()

  const [isPotModalOpen, setIsPotModalOpen] = useState(false)

  const {
    data: pots,
    mutate,
    isValidating,
  } = useRequest<AllPotsProps>({
    url: `/pots`,
    method: 'GET',
  })

  return isRouteLoading ? (
    <LoadingPage />
  ) : (
    <>
      <NextSeo
        title="Pots | Finance App"
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
          className={`px-4 py-5 md:p-10 pb-20 md:pb-32 lg:pb-8 lg:pl-0 ${
            isSidebarOpen ? 'lg:pr-10' : 'lg:pr-20'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-8">
            <h1 className="text-gray-900 font-bold text-3xl">Pots</h1>
            <Dialog.Root open={isPotModalOpen}>
              <Dialog.Trigger asChild>
                <button
                  onClick={() => setIsPotModalOpen(true)}
                  className={`font-semibold rounded-md p-3 px-4 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed`}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add Pot
                </button>
              </Dialog.Trigger>
              <PotModalForm
                onClose={() => setIsPotModalOpen(false)}
                onSubmitForm={async (): Promise<void> => {
                  await mutate()
                }}
              />
            </Dialog.Root>
          </div>

          {isValidating ? (
            <>
              <div className="flex flex-col w-full lg:grid lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonPotCard key={index} />
                ))}
              </div>
            </>
          ) : pots && pots?.pots.length ? (
            <div className="flex flex-col w-full lg:grid lg:grid-cols-2 gap-6">
              {pots?.pots.map((pot) => {
                return (
                  <PotCard
                    key={pot.id}
                    potId={pot.id}
                    onSubmitForm={async (): Promise<void> => {
                      await mutate()
                    }}
                  />
                )
              })}
            </div>
          ) : (
            <div>
              <EmptyContent variant="secondary" content="No pots available." />
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}
