import { UserProps } from "@/types/user";
import { CATEGORIES } from "./constants";

export const getDefaultBudgets = (createdUser: UserProps) => {
  return [
    {
      amount: 75,
      categoryId: CATEGORIES.GENERAL,
      userId: createdUser.id,
      themeId: "1",
    },
    {
      amount: 50,
      categoryId: CATEGORIES.EDUCATION,
      userId: createdUser.id,
      themeId: "3",
    },
    {
      amount: 100,
      categoryId: CATEGORIES.ENTERTAINMENT,
      userId: createdUser.id,
      themeId: "5",
    },
    {
      amount: 750,
      categoryId: CATEGORIES.LIFESTYLE,
      userId: createdUser.id,
      themeId: "7",
    },
  ];
};
