import { UserProps } from "./user";

export interface BalanceProps {
  id: string;
  current: number;
  income: number;
  expenses: number;
  userId: string;
  user: UserProps;
}
