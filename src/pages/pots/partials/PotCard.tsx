import { PotProps } from '@/types/pot'
import { formatToDollar } from '@/utils/formatToDollar'
import useRequest from '@/utils/useRequest'
import { faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { PotModalForm } from './PotModal'
import * as Dialog from '@radix-ui/react-dialog'
import { DeletePotModal } from './DeletePotModal'
import { EditPotAmountModal } from './EditPotAmountModal'

interface PotWithDetails {
  pot: PotProps
  percentageSpent: number
}

interface PotCardProps {
  potId: string
  onSubmitForm: () => Promise<void>
}

export const PotCard = ({ potId, onSubmitForm }: PotCardProps) => {
  const [isPotDropdownOpen, setIsPotDropdownOpen] = useState(false)

  const [isPotModalOpen, setIsPotModalOpen] = useState(false)

  const [isWithdrawPotAmountModalOpen, setIsWithdrawPotAmountModalOpen] =
    useState(false)

  const [isAddPotAmountModalOpen, setIsAddPotAmountModalOpen] = useState(false)

  const [isDeletePotModalOpen, setIsDeletePotModalOpen] = useState(false)

  const { data: pot, mutate } = useRequest<PotWithDetails>({
    url: `/pots/${potId}`,
    method: 'GET',
  })

  const originalPercentage = Math.max(
    0,
    Math.min(
      100,
      ((pot?.pot.currentAmount || 0) / (pot?.pot.targetAmount || 0)) * 100,
    ),
  )

  return (
    <div className="flex flex-col bg-white px-5 py-6 rounded-md md:p-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span
            className="w-[16px] h-[16px] rounded-full"
            style={{ backgroundColor: pot?.pot?.theme.color }}
          />
          <h2 className="text-xl font-bold">{pot?.pot?.name}</h2>
        </div>
        <div className="flex flex-col gap-2 items-end justify-end relative">
          <FontAwesomeIcon
            className="text-gray-500 relative cursor-pointer"
            icon={faEllipsis}
            onClick={() => setIsPotDropdownOpen(!isPotDropdownOpen)}
          />
          {isPotDropdownOpen && (
            <div className="absolute top-[1.5rem] w-[8.5rem] gap-1 flex flex-col bg-white shadow-xl p-3 rounded-lg items-start text-start">
              <Dialog.Root open={isPotModalOpen}>
                <Dialog.Trigger asChild>
                  <button
                    onClick={() => setIsPotModalOpen(true)}
                    className="cursor-pointer hover:text-gray-500 text-sm text-gray-800"
                  >
                    Edit Pot
                  </button>
                </Dialog.Trigger>
                {pot?.pot && (
                  <PotModalForm
                    isEdit
                    onSubmitForm={async () => {
                      await mutate()
                      await onSubmitForm()
                      setIsPotDropdownOpen(false)
                    }}
                    potId={pot.pot.id}
                    name={pot.pot.name}
                    currentAmount={pot.pot.currentAmount}
                    targetAmount={pot.pot.targetAmount}
                    themeColor={pot?.pot.theme.color}
                    onClose={() => {
                      setIsPotModalOpen(false)
                      setIsPotDropdownOpen(false)
                    }}
                  />
                )}
              </Dialog.Root>
              <span className="my-1 w-full h-[1px] bg-gray-200 text-gray-500" />
              <Dialog.Root open={isDeletePotModalOpen}>
                <Dialog.Trigger asChild>
                  <button
                    onClick={() => setIsDeletePotModalOpen(true)}
                    className="cursor-pointer hover:brightness-150 text-sm text-secondary-red"
                  >
                    Delete Pot
                  </button>
                </Dialog.Trigger>
                {pot && (
                  <DeletePotModal
                    onSubmitForm={async () => {
                      await mutate()
                      await onSubmitForm()
                      setIsPotDropdownOpen(false)
                    }}
                    onClose={() => {
                      setIsDeletePotModalOpen(false)
                      setIsPotDropdownOpen(false)
                    }}
                    pot={pot.pot}
                  />
                )}
              </Dialog.Root>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full mt-10">
        <div className="flex items-center justify-between w-full">
          <p className="text-gray-500 text-sm">Total Saved</p>
          <h2 className="text-3xl font-bold">{`${formatToDollar(
            pot?.pot.currentAmount || 0,
          )}`}</h2>
        </div>
      </div>
      <div className="mt-4 w-full h-[0.9rem] p-[0.1rem] bg-beige-100 rounded-full">
        <div
          className="h-full rounded-full bg-secondary-green"
          style={{
            width: `${
              (pot?.percentageSpent || 0) > 100
                ? '100'
                : pot?.percentageSpent || 0
            }%`,
            backgroundColor: pot?.pot?.theme.color,
          }}
        />
      </div>
      <div className="flex flex-col w-full mt-3">
        <div className="flex items-center justify-between w-full">
          <p className="text-gray-500 font-bold text-xs">{`${pot?.percentageSpent}%`}</p>
          <p className="text-gray-500 text-xs">{`Target of ${formatToDollar(
            pot?.pot.targetAmount || 0,
          )}`}</p>
        </div>
      </div>

      <div className="flex items-center w-full gap-3 mt-12">
        <Dialog.Root open={isAddPotAmountModalOpen}>
          <Dialog.Trigger asChild>
            <button
              onClick={() => setIsAddPotAmountModalOpen(true)}
              className={`font-semibold rounded-md py-4 px-3 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-beige-100 text-grau-900 hover:brightness-90 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed w-full`}
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.7rem' }} />
              Add Money
            </button>
          </Dialog.Trigger>
          {pot?.pot && (
            <EditPotAmountModal
              id={pot.pot.id}
              originalPercentage={originalPercentage}
              name={pot.pot.name}
              currentAmount={pot?.pot.currentAmount}
              themeColor={pot?.pot.theme.color}
              targetAmount={pot?.pot.targetAmount}
              onClose={() => setIsAddPotAmountModalOpen(false)}
              onSubmitForm={async () => {
                await mutate()
                await onSubmitForm()
                setIsPotDropdownOpen(false)
              }}
            />
          )}
        </Dialog.Root>
        <Dialog.Root open={isWithdrawPotAmountModalOpen}>
          <Dialog.Trigger asChild>
            <button
              onClick={() => setIsWithdrawPotAmountModalOpen(true)}
              className={`font-semibold rounded-md py-4 px-3 items-center flex gap-2 transition-all duration-300 max-h-[60px] text-sm bg-beige-100 text-grau-900 hover:brightness-90 capitalize justify-center disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed w-full`}
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.7rem' }} />
              Withdraw
            </button>
          </Dialog.Trigger>
          {pot?.pot && (
            <EditPotAmountModal
              isWithdraw
              id={pot.pot.id}
              name={pot.pot.name}
              originalPercentage={originalPercentage}
              currentAmount={pot?.pot.currentAmount}
              themeColor={pot?.pot.theme.color}
              targetAmount={pot?.pot.targetAmount}
              onClose={() => setIsWithdrawPotAmountModalOpen(false)}
              onSubmitForm={async () => {
                await mutate()
                await onSubmitForm()
                setIsPotDropdownOpen(false)
              }}
            />
          )}
        </Dialog.Root>
      </div>
    </div>
  )
}
