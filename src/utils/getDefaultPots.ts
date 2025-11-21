import { UserProps } from "@/types/user";

export const getDefaultPots = (createdUser: UserProps) => {
  return [
    {
      name: "Savings",
      targetAmount: 2000,
      currentAmount: 159,
      userId: createdUser.id,
      themeId: "12",
    },
    {
      name: "New Laptop",
      targetAmount: 1000,
      currentAmount: 10,
      userId: createdUser.id,
      themeId: "11",
    },
    {
      name: "Concert Ticket",
      targetAmount: 150,
      currentAmount: 130,
      userId: createdUser.id,
      themeId: "9",
    },
    {
      name: "Gift",
      targetAmount: 60,
      currentAmount: 40,
      userId: createdUser.id,
      themeId: "8",
    },
  ];
};
