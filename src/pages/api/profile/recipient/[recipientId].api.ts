import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { recipientId } = req.query

    if (!recipientId || typeof recipientId !== 'string') {
      return res.status(400).json({ message: 'Invalid recipient account ID' })
    }

    try {
      const profile = await prisma.user.findUnique({
        where: {
          id: recipientId, // Usando o accountId corretamente
        },
      })

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' })
      }

      return res.status(200).json({ profile, message: 'Profile found!' })
    } catch (error) {
      console.error('Error fetching profile:', error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}
