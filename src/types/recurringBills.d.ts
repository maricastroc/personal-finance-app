import { TransactionProps } from "./transaction";
import { UserProps } from "./user";

export interface RecurringBillProps {
  id: string;
  description: string;
  amount: number;
  recurrenceDay?: string;
  recurrenceFrequency?: string;
  transaction?: TransactionProps;
  nextDueDate?: Date;
  lastPaidDate?: Date;
  baseDate?: Date;
  userId: string;
  user: UserProps;
  status?: string;
  contactName: string;
  contactAvatar: string;
  balance?: "expense" | "income";
}
