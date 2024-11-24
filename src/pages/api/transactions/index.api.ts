import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

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

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: String(userId),
      },
      include: {
        category: true,
        sender: true,
        recipient: true,
      },
    })

    return res.status(200).json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
