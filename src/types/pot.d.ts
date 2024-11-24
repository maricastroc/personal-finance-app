import { ThemeProps } from './theme'
import { UserProps } from './user'

export interface PotProps {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  themeId: string
  theme: ThemeProps
  userId: string
  user: UserProps
}
