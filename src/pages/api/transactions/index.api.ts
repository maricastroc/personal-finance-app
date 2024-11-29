import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { Prisma } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { accountId: true },
      })

      if (!user || !user.accountId) {
        return res.status(404).json({ message: 'User account not found' })
      }

      const userAccountId = user.accountId

      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const filterByName = req.query.filterByName as string
      const sortBy = req.query.sortBy as string
      const skip = (page - 1) * limit

      const where: Prisma.TransactionWhereInput = {
        userId: String(userId),
      }

      if (
        filterByName &&
        filterByName !== 'all' &&
        typeof filterByName === 'string'
      ) {
        where.category = {
          name: {
            contains: filterByName.trim(),
            mode: 'insensitive',
          },
        }
      }

      let orderBy: Prisma.TransactionOrderByWithRelationInput = {}

      switch (sortBy) {
        case 'latest':
          orderBy = { date: 'desc' }
          break
        case 'oldest':
          orderBy = { date: 'asc' }
          break
        case 'a_to_z':
          orderBy = { recipient: { name: 'asc' } }
          break
        case 'z_to_a':
          orderBy = { recipient: { name: 'desc' } }
          break
        case 'highest':
          orderBy = { amount: 'desc' }
          break
        case 'lowest':
          orderBy = { amount: 'asc' }
          break
        default:
          orderBy = { date: 'desc' }
      }

      let searchQuery

      if (req.query.search && req.query.search !== '') {
        searchQuery = String(req.query.search).toLowerCase()
      }

      const transactions = await prisma.transaction.findMany({
        where: {
          ...where,
          ...(searchQuery && {
            OR: [
              {
                sender: {
                  name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                  },
                },
              },
              {
                recipient: {
                  name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }),
        },
        include: {
          category: true,
          sender: true,
          recipient: true,
        },
        orderBy,
        skip,
        take: limit,
      })

      const totalTransactions = await prisma.transaction.count({ where })

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
  } else if (req.method === 'POST') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accountId: true },
    })

    if (!user || !user.accountId) {
      return res.status(404).json({ message: 'User account not found' })
    }

    const accountId = user.accountId

    const { description, amount, categoryName, recipientId, isRecurring } =
      req.body

    if (!categoryName || !amount || !recipientId || isRecurring === null) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const recipient = await prisma.user.findUnique({
      where: { accountId: recipientId },
    })

    if (!recipient) {
      return res.status(400).json({ message: 'Recipient does not exist' })
    }

    const category = await prisma.category.findUnique({
      where: { name: categoryName },
    })

    if (!category) {
      return res
        .status(400)
        .json({ message: 'Selected category does not exist' })
    }

    const categoryId = category.id

    try {
      const transaction = await prisma.transaction.create({
        data: {
          description,
          amount,
          categoryId,
          recipientId,
          senderId: accountId,
          userId,
          isRecurring,
        },
      })

      if (isRecurring) {
        const { recurrenceDay, recurrenceFrequency } = req.body

        if (!recurrenceDay || !recurrenceFrequency) {
          return res.status(400).json({ message: 'Missing required fields' })
        }

        await prisma.recurringBill.create({
          data: {
            description,
            amount,
            recurrenceDay,
            recurrenceFrequency,
            categoryId,
            senderId: accountId,
            recipientId,
            userId,
          },
        })
      }

      return res.status(201).json({
        message: 'Transaction created successfully',
        transaction,
      })
    } catch (error) {
      console.error('Error creating transaction:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}
