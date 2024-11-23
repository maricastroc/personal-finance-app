import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'A', value: 50 },
  { name: 'B', value: 100 },
  { name: 'C', value: 750 },
  { name: 'D', value: 75 },
]

const COLORS = ['#277c78', '#f2cdac', '#82c9d7', '#626070']

export default function BudgetItem() {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
      style={{ maxWidth: '20rem', margin: '0 auto' }}
    >
      <PieChart>
        {/* Camada externa */}
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%" // Centro do gráfico
          cy="50%" // Centro do gráfico
          innerRadius={'80%'} // Raio interno fixo
          outerRadius={'100%'}
          paddingAngle={0} // Remove o espaço entre as fatias
          cornerRadius={0}
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-outer-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        {/* Camada interna com transparência */}
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
          {data.map((entry, index) => (
            <Cell
              key={`cell-inner-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
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
          $338
        </text>
        <text
          x="50%"
          y="55%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#696868"
          fontSize="15"
        >
          of $975 limit
        </text>
      </PieChart>
    </ResponsiveContainer>
  )
}
