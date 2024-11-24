import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const userId = String(req.query.userId)

  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  return res.json({ profile })
}
