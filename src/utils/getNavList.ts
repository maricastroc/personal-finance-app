import navHome from '/public/assets/images/icon-nav-overview.svg'
import navHomeActive from '/public/assets/images/icon-nav-overview-active.svg'
import navTransactionActive from '/public/assets/images/icon-nav-transactions-active.svg'
import navTransaction from '/public/assets/images/icon-nav-transactions.svg'
import navBudgets from '/public/assets/images/icon-nav-budgets.svg'
import navBudgetsActive from '/public/assets/images/icon-nav-budgets-active.svg'
import navPots from '/public/assets/images/icon-nav-pots.svg'
import navPotsActive from '/public/assets/images/icon-nav-pots-active.svg'
import recBills from '/public/assets/images/icon-nav-recurring-bills.svg'
import recBillsActive from '/public/assets/images/icon-nav-recurring-bills-active.svg'
import user from '/public/assets/images/user-solid.svg'
import userActive from '/public/assets/images/user-solid-active.svg'

type ItemProps = {
  name: string
  icon: string
  iconActive: string
  href: string
}

export type Item = {
  item: ItemProps
  active?: boolean
  menuShown?: boolean
}

export const navList = [
  {
    name: 'Overview',
    icon: navHome,
    iconActive: navHomeActive,
    href: '/',
  },
  {
    name: 'Transactions',
    icon: navTransaction,
    iconActive: navTransactionActive,
    href: '/transactions',
  },
  {
    name: 'Budgets',
    icon: navBudgets,
    iconActive: navBudgetsActive,
    href: '/budgets',
  },
  {
    name: 'Pots',
    icon: navPots,
    iconActive: navPotsActive,
    href: '/pots',
  },
  {
    name: 'Recurring Bills',
    icon: recBills,
    iconActive: recBillsActive,
    href: '/recurring_bills',
  },

  {
    name: 'Profile',
    icon: user,
    iconActive: userActive,
    href: '/profile',
  },
]
