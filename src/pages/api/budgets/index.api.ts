import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { getServerSession } from 'next-auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )

  if (!session) {
    return res.status(400).json({ message: 'Unauthorized' })
  }

  const userId = session?.user?.id?.toString()

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // 1. Recuperar o user para obter o accountId
    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: { accountId: true }, // Seleciona apenas o accountId
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const accountId = user.accountId

    // 2. Recuperar os budgets do usuário
    const budgets = await prisma.budget.findMany({
      where: { userId: String(userId) }, // Filtra budgets por userId
      include: {
        category: true, // Inclui a categoria associada ao budget
        theme: true, // Inclui o tema associado ao budget
      },
    })

    // 3. Recuperar todas as transações do usuário com o accountId
    const transactions = await prisma.transaction.findMany({
      where: {
        senderId: accountId, // Transações enviadas pelo accountId do usuário
      },
      include: {
        category: true, // Inclui a categoria da transação
      },
    })

    // 4. Calcular o total gasto por categoria
    const budgetsWithDetails = budgets.map((budget) => {
      // Filtra transações pela categoria do budget
      const totalSpentInCategory = transactions
        .filter((transaction) => transaction.categoryId === budget.categoryId)
        .reduce((sum, transaction) => sum + transaction.amount, 0)

      // Retorna o budget com o valor gasto calculado
      return {
        id: budget.id,
        categoryName: budget.category.name,
        amountSpent: totalSpentInCategory,
        budgetLimit: budget.amount, // O limite do orçamento
        theme: budget.theme?.color, // Tema associado ao orçamento
      }
    })

    // Retorna os budgets com os detalhes
    return res.json({ budgets: budgetsWithDetails })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'An error occurred' })
  }
}
