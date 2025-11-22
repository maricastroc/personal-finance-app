import { CategoryProps } from "./category";
import { RecurringBillProps } from "./recurringBills";
import { UserProps } from "./user";

export interface TransactionProps {
  id: string;
  description: string;
  amount: number;
  date: Date;
  isRecurring: boolean;
  userId: string;
  user: UserProps;
  balance?: "expense" | "income";
  contactName: string;
  contactAvatar: string;
  category?: CategoryProps;
  recurringBill?: RecurringBillProps;
}
