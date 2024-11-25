import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { Prisma } from '@prisma/client'

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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountId: true },
    })

    if (!user || !user.accountId) {
      return res.status(404).json({ message: 'User account not found' })
    }

    const userAccountId = user.accountId

    // Query params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const filterByName = req.query.filterByName as string
    const sortBy = req.query.sortBy as string

    const skip = (page - 1) * limit

    // Filtros
    const filters: Prisma.TransactionWhereInput = {
      userId: String(userId),
    }

    if (
      filterByName &&
      filterByName !== 'all' &&
      typeof filterByName === 'string'
    ) {
      filters.category = {
        name: {
          contains: filterByName.trim(), // Remove espaços extras
          mode: 'insensitive',
        },
      }
    }

    // Ordenação
    let orderBy: Prisma.TransactionOrderByWithRelationInput = {}
    switch (sortBy) {
      case 'latest':
        orderBy = { date: 'desc' }
        break
      case 'oldest':
        orderBy = { date: 'asc' }
        break
      case 'a_to_z':
        orderBy = { category: { name: 'asc' } }
        break
      case 'z_to_a':
        orderBy = { category: { name: 'desc' } }
        break
      case 'highest':
        orderBy = { amount: 'desc' }
        break
      case 'lowest':
        orderBy = { amount: 'asc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const transactions = await prisma.transaction.findMany({
      where: filters,
      include: {
        category: true,
        sender: true,
        recipient: true,
      },
      orderBy,
      skip,
      take: limit,
    })

    const totalTransactions = await prisma.transaction.count({ where: filters })

    const transactionsWithBalance = transactions.map((transaction) => {
      const balance =
        transaction.senderId === userAccountId ? 'expense' : 'income'

      return {
        ...transaction,
        balance,
      }
    })

    const data = {
      transactions: transactionsWithBalance,
      pagination: {
        page,
        limit,
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
      },
    }

    return res.status(200).json({ data })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
