import { UserProps } from './user'

export interface TransactionProps {
  id: string
  description: string
  amount: number
  date: Date
  isRecurring: boolean
  senderId: string
  recipientId: string
  userId: string
  user: UserProps
  balance?: 'expense' | 'income'
  sender: UserProps
  recipient: UserProps
}
