import { UserProps } from './user'

export interface RecurringBillProps {
  id: string
  description: string
  amount: number
  recurrenceDay?: string
  recurrenceFrequency?: string
  senderId: string
  recipientId: string
  recipient: UserProps
  sender: UserProps
  userId: string
  user: UserProps
  status?: string
}
