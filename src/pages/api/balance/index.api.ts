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
    // 1. Recuperar o usuário com base no userId para pegar o accountId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const accountId = user.accountId

    // 2. Recuperar todas as transações do usuário
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: accountId }, // Transações enviadas pelo usuário
          { recipientId: accountId }, // Transações recebidas pelo usuário
        ],
      },
      select: {
        amount: true,
        senderId: true,
        recipientId: true,
      },
    })

    // 3. Calcular o saldo atual, despesas e receitas
    let expenses = 0
    let incomes = 0
    let currentBalance = 0

    transactions.forEach((transaction) => {
      if (transaction.senderId === accountId) {
        // Se sou o sender, é uma despesa
        expenses += transaction.amount
      }
      if (transaction.recipientId === accountId) {
        // Se sou o recipient, é uma receita
        incomes += transaction.amount
      }
    })

    // Calculando o currentBalance
    currentBalance = incomes - expenses + (user?.initialBalance || 0)

    // Retornando o saldo atual, despesas e receitas
    return res.json({
      currentBalance,
      expenses,
      incomes,
      transactions,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'An error occurred' })
  }
}
