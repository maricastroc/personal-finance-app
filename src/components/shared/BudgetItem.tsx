import { formatToDollar } from '@/utils/formatToDollar'
import useRequest from '@/utils/useRequest'
import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export interface BudgetWithDetailsProps {
  categoryName: string
  amountSpent: number
  theme: string
  budgetLimit: number
}

export default function BudgetItem() {
  const { data: budgets } = useRequest<BudgetWithDetailsProps[]>({
    url: '/budgets',
    method: 'GET',
  })

  const data = budgets?.map((budget: BudgetWithDetailsProps) => ({
    name: budget.categoryName,
    value: budget.budgetLimit,
  }))

  const budgetLimitSum =
    budgets?.reduce((sum, budget) => sum + budget.budgetLimit, 0) || 0
  const amountSpentSum =
    budgets?.reduce((sum, budget) => sum + budget.amountSpent, 0) || 0

  return (
    <ResponsiveContainer
      width="100%"
      height={331.5}
      style={{ maxWidth: '20rem', margin: '0 auto' }}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={'80%'}
          outerRadius={'100%'}
          paddingAngle={0}
          cornerRadius={0}
          stroke="none"
        >
          {budgets?.map((budget, index) => (
            <Cell key={`cell-outer-${index}`} fill={budget.theme} />
          ))}
        </Pie>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          paddingAngle={0}
          cornerRadius={0}
          stroke="none"
          cx="50%"
          cy="50%"
          innerRadius={'67%'}
          outerRadius={'80%'}
          fillOpacity={0.7}
        >
          {budgets?.map((budget, index) => (
            <Cell key={`cell-outer-${index}`} fill={budget.theme} />
          ))}
        </Pie>
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#000"
          fontSize="24"
          fontWeight="bold"
        >
          {formatToDollar(amountSpentSum)}
        </text>
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#696868"
          fontSize="15"
        >
          of {formatToDollar(budgetLimitSum)} limit
        </text>
      </PieChart>
    </ResponsiveContainer>
  )
}
