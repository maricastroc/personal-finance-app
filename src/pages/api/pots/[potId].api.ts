import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { getServerSession } from 'next-auth'

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
      const { potId } = req.query

      if (!potId) {
        return res.status(400).json({ message: 'Pot ID is required' })
      }

      const user = await prisma.user.findUnique({
        where: { id: String(userId) },
        select: { accountId: true },
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const pot = await prisma.pot.findUnique({
        where: { id: String(potId) },
        include: {
          theme: true,
        },
      })

      if (!pot) {
        return res.status(404).json({ message: 'Pot not found' })
      }

      const percentageSpent = (pot.currentAmount / pot.targetAmount) * 100

      const potWithDetails = {
        pot,
        percentageSpent: percentageSpent.toFixed(2),
      }

      return res.json({ pot: potWithDetails })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'An error occurred' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { potId } = req.query

      const { name, themeColor, targetAmount, currentAmount } = req.body

      if (!potId || !name || !themeColor || !targetAmount || !currentAmount) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      let theme = await prisma.theme.findUnique({
        where: { color: themeColor },
      })

      if (!theme) {
        theme = await prisma.theme.create({
          data: { color: themeColor },
        })
      }

      const updatedPot = await prisma.pot.update({
        where: { id: String(potId) },
        data: {
          themeId: theme.id,
          targetAmount,
          currentAmount,
          name,
        },
        include: {
          theme: true,
        },
      })

      return res.status(200).json({
        pot: updatedPot,
        message: 'Pot successfully updated!',
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'An error occurred' })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, themeColor, targetAmount } = req.body

      if (!name || !themeColor || !targetAmount) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      let theme = await prisma.theme.findUnique({
        where: { color: themeColor },
      })

      if (!theme) {
        theme = await prisma.theme.create({
          data: { color: themeColor },
        })
      }

      const newPot = await prisma.pot.create({
        data: {
          userId,
          name,
          themeId: theme.id,
          targetAmount,
          currentAmount: 0,
        },
        include: {
          theme: true,
        },
      })

      return res.status(200).json({
        pot: newPot,
        message: 'Pot successfully created!',
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'An error occurred' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { potId } = req.query

      if (!potId) {
        return res.status(400).json({ message: 'Pot ID is required' })
      }

      const pot = await prisma.pot.findUnique({
        where: { id: String(potId) },
      })

      if (!pot) {
        return res.status(404).json({ message: 'Pot not found' })
      }

      if (pot.userId !== userId) {
        return res.status(403).json({
          message: 'Forbidden: You are not allowed to delete this pot',
        })
      }

      await prisma.pot.delete({
        where: { id: String(potId) },
      })

      return res.status(200).json({ message: 'Pot successfully deleted!' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'An error occurred' })
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
}
