/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import useRequest from '@/utils/useRequest'

import { AxiosResponse } from 'axios'
import { AllPotsProps } from '@/pages/home'
import { PotCardHeader } from './partials/PotCardHeader'
import { PotCardValue } from './partials/PotCardValue'
import { PotProgressBar } from './partials/PotProgressBar'
import { PotAmountButtons } from './partials/PotAmountButtons'
import { DeletePotModal } from '../DeletePotModal'
import { EditPotAmountModal } from '../EditPotAmountModal'

interface PotCardProps {
  potId: string
  onSubmitForm: () => Promise<
    void | AxiosResponse<AllPotsProps, any> | undefined
  >
}

export const PotCard = ({ potId, onSubmitForm }: PotCardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const [isEditOpen, setIsEditOpen] = useState(false)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [isAddOpen, setIsAddOpen] = useState(false)

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

  const { data: pot, mutate } = useRequest<PotWithDetails>(
    {
      url: `/pots/${potId}`,
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

  async function refreshAll() {
    await mutate()
    await onSubmitForm()
    setIsDropdownOpen(false)
  }

  if (!pot) return null

  const percentage = pot.percentageSpent

  const originalPercentage = Math.max(
    0,
    Math.min(100, (pot.pot.currentAmount / pot.pot.targetAmount) * 100),
  )

  return (
    <div className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
      <PotCardHeader
        pot={pot.pot}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setIsEditOpen={setIsEditOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />

      <PotCardValue pot={pot.pot} />

      <PotProgressBar
        percentage={percentage}
        color={pot.pot.theme.color}
        target={pot.pot.targetAmount}
      />

      <PotAmountButtons
        pot={pot.pot}
        originalPercentage={originalPercentage}
        isAddOpen={isAddOpen}
        setIsAddOpen={setIsAddOpen}
        isWithdrawOpen={isWithdrawOpen}
        setIsWithdrawOpen={setIsWithdrawOpen}
        refreshAll={refreshAll}
      />

      <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DeletePotModal
          onSubmitForm={async () => {
            await mutate()
            await onSubmitForm()
            setIsDropdownOpen(false)
          }}
          onClose={() => {
            setIsDeleteOpen(false)
            setIsDropdownOpen(false)
          }}
          pot={pot.pot}
        />
      </Dialog.Root>

      <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
        <EditPotAmountModal
          id={pot.pot.id}
          originalPercentage={originalPercentage}
          name={pot.pot.name}
          currentAmount={pot?.pot.currentAmount}
          themeColor={pot?.pot.theme.color}
          targetAmount={pot?.pot.targetAmount}
          onClose={() => setIsAddOpen(false)}
          onSubmitForm={async () => {
            await mutate()
            await onSubmitForm()
            setIsDropdownOpen(false)
          }}
        />
      </Dialog.Root>
    </div>
  )
}
