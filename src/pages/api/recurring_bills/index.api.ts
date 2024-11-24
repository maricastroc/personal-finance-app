import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'
import { getServerSession } from 'next-auth'
import { isBefore, startOfDay, addDays, isWithinInterval } from 'date-fns'
import { RecurringBill } from '@prisma/client'

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
    // Obtenha todos os Recurring Bills do usuário
    const recurringBills = await prisma.user.findMany({
      where: { id: String(userId) },
      include: {
        recurringBills: true,
      },
    })

    if (recurringBills.length === 0 || !recurringBills[0]?.recurringBills) {
      return res.status(404).json({ message: 'No recurring bills found' })
    }

    const bills = recurringBills[0].recurringBills

    // Data de hoje
    const today = startOfDay(new Date())

    // Data para comparar se está dentro de 3 dias
    const dueSoonDate = addDays(today, 3)

    // Inicializando as categorias
    const result = {
      paid: {
        bills: [] as RecurringBill[],
        total: 0,
      },
      dueSoon: {
        bills: [] as RecurringBill[],
        total: 0,
      },
      upcoming: {
        bills: [] as RecurringBill[],
        total: 0,
      },
    }

    // Classificar as bills nas categorias
    for (const bill of bills) {
      // Cria uma data com base no dia de recorrência da fatura, mas no mês atual
      const recurrenceDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        bill.recurrenceDay || 1,
      )

      // Se a data de recorrência for antes de hoje, classifica como "paid"
      if (isBefore(recurrenceDate, today)) {
        result.paid.bills.push(bill)
        result.paid.total += bill.amount
      }
      // Se a data de recorrência for em até 3 dias, classifica como "due soon"
      else if (
        isWithinInterval(recurrenceDate, { start: today, end: dueSoonDate })
      ) {
        result.dueSoon.bills.push(bill)
        result.dueSoon.total += bill.amount
      }
      // Se a data de recorrência for no futuro e não dentro dos próximos 3 dias, classifica como "upcoming"
      else {
        result.upcoming.bills.push(bill)
        result.upcoming.total += bill.amount
      }
    }

    // Devolvendo o objeto completo com as categorias e totais
    return res.json({ recurringBills: result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'An error occurred' })
  }
}
