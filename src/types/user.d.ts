import { AccountProps } from "./account";
import { BalanceProps } from "./balance";
import { BudgetProps } from "./budget";
import { PotProps } from "./pot";
import { SessionProps } from "./session";

export interface UserProps {
  id: string;
  name: string;
  avatarUrl?: string | null | undefined;
  createdAt?: Date;
  password?: string | null;
  email?: string;
  accountId?: string;
  initialBalance?: number;

  accounts?: AccountProps[] | null | undefined;
  sessions?: SessionProps[] | null | undefined;
  pots: PotProps[];
  budgets: BudgetProps[];
  balance: BalanceProps;
}
