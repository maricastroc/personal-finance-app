import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../auth/[...nextauth].api'

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
    // Obtenha o `accountId` do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountId: true }, // Pegando só o accountId
    })

    if (!user || !user.accountId) {
      return res.status(404).json({ message: 'User account not found' })
    }

    const userAccountId = user.accountId

    // Busca as transações do usuário, ordenando por createdAt (mais recentes primeiro)
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: String(userId),
      },
      include: {
        category: true,
        sender: true,
        recipient: true,
      },
      orderBy: {
        date: 'desc', // Ordena pelas transações mais recentes
      },
      take: 5,
    })

    // Modificar cada transação para adicionar o campo "balance"
    const transactionsWithBalance = transactions.map((transaction) => {
      // Verifica se o senderId é igual ao accountId do usuário
      const balance =
        transaction.senderId === userAccountId ? 'expense' : 'income'

      return {
        ...transaction,
        balance,
      }
    })

    return res.status(200).json({ transactions: transactionsWithBalance })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
