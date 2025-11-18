import * as Dialog from '@radix-ui/react-dialog'
import { BudgetModal } from './BudgetModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { getBudgetsCategories } from '@/utils/getBudgetsCategories'
import { BudgetWithDetailsProps } from '@/components/shared/BudgetItem'
import { AxiosResponse } from 'axios'
import { KeyedMutator } from 'swr'

interface PageHeaderProps {
  isBudgetModalOpen: boolean
  setIsBudgetModalOpen: (value: boolean) => void
  budgets: BudgetWithDetailsProps[] | undefined
  mutate: KeyedMutator<
    AxiosResponse<BudgetWithDetailsProps[], BudgetWithDetailsProps>
  >
}

export const PageHeader = ({
  isBudgetModalOpen,
  budgets,
  setIsBudgetModalOpen,
  mutate,
}: PageHeaderProps) => {
  return (
    <header
      className="flex items-center justify-between w-full mb-8"
      aria-label="Budgets Header"
    >
      <h1 className="text-gray-900 font-bold text-3xl">Budgets</h1>

      <Dialog.Root open={isBudgetModalOpen} onOpenChange={setIsBudgetModalOpen}>
        <Dialog.Trigger asChild>
          <button
            aria-haspopup="dialog"
            aria-expanded={isBudgetModalOpen}
            aria-controls="budget-modal"
            className="font-semibold rounded-md p-3 px-4 flex gap-2 items-center transition-all duration-300 max-h-[60px] text-sm bg-gray-900 text-beige-100 hover:bg-gray-500 capitalize focus:outline-offset-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Budget
          </button>
        </Dialog.Trigger>

        <BudgetModal
          id="budget-modal"
          isOpen={isBudgetModalOpen}
          onOpenChange={() => setIsBudgetModalOpen(!isBudgetModalOpen)}
          onClose={() => setIsBudgetModalOpen(false)}
          existedCategories={getBudgetsCategories(budgets)}
          onSubmitForm={async () => {
            await mutate()
          }}
        />
      </Dialog.Root>
    </header>
  )
}
