import { UserProps } from '@/types/user'

export const getDefaultBudgets = (createdUser: UserProps) => {
  return [
    {
      amount: 75,
      categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
      userId: createdUser.id,
      themeId: '75bc8ac0-35f9-4549-97e9-8acd53c56f09',
    },
    {
      amount: 50,
      categoryId: '6be79763-1678-485b-839f-590fa20c816f',
      userId: createdUser.id,
      themeId: '49fcf105-e8a9-49b0-af57-43bb7ccabae1',
    },
    {
      amount: 100,
      categoryId: '6bb2b046-de5a-4928-aa6d-81545793d5f3',
      userId: createdUser.id,
      themeId: '0f23f996-6d7f-48ae-b034-43640799ca96',
    },
    {
      amount: 750,
      categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
      userId: createdUser.id,
      themeId: 'd33c33a5-2b16-475d-840e-76961b9765a4',
    },
  ]
}
