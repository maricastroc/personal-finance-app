import { CategoryProps } from "./category";
import { ThemeProps } from "./theme";
import { UserProps } from "./user";

export interface BudgetProps {
  id: string;
  amount: number;
  createdAt?: Date;
  categoryId: string;
  category: CategoryProps;
  themeId: string;
  theme: ThemeProps;
  userId: string;
  user: UserProps;
}
