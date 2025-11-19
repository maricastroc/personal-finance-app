import { UserProps } from "@/types/user";

export const getDefaultPots = (createdUser: UserProps) => {
  return [
    {
      name: "Savings",
      targetAmount: 2000,
      currentAmount: 159,
      userId: createdUser.id,
      themeId: "49fcf105-e8a9-49b0-af57-43bb7ccabae1",
    },
    {
      name: "New Laptop",
      targetAmount: 1000,
      currentAmount: 10,
      userId: createdUser.id,
      themeId: "75bc8ac0-35f9-4549-97e9-8acd53c56f09",
    },
    {
      name: "Concert Ticket",
      targetAmount: 150,
      currentAmount: 130,
      userId: createdUser.id,
      themeId: "0f23f996-6d7f-48ae-b034-43640799ca96",
    },
    {
      name: "Gift",
      targetAmount: 60,
      currentAmount: 40,
      userId: createdUser.id,
      themeId: "d33c33a5-2b16-475d-840e-76961b9765a4",
    },
  ];
};
