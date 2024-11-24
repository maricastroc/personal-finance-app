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
    // Buscar todos os pots do usuário e calcular a soma do currentAmount
    const pots = await prisma.pot.findMany({
      where: { userId: String(userId) },
      include: {
        theme: true,
      },
    })

    const totalCurrentAmount = pots.reduce(
      (sum, pot) => sum + pot.currentAmount,
      0,
    )

    const potsWithTotalCurrentAmount = {
      pots,
      totalCurrentAmount,
    }
    return res.json({ pots: potsWithTotalCurrentAmount })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'An error occurred' })
  }
}
