import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import {
  isBefore,
  startOfDay,
  addDays,
  isWithinInterval,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { RecurringBill } from "@prisma/client";
import { buildNextAuthOptions } from "../../auth/[...nextauth].api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const userId = session?.user?.id?.toString();

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const recurringBills = await prisma.user.findMany({
      where: { id: String(userId) },
      include: {
        recurringBills: {
          include: {
            recipient: true,
          },
        },
      },
    });

    if (recurringBills.length === 0 || !recurringBills[0]?.recurringBills) {
      return res.status(404).json({ message: "No recurring bills found" });
    }

    const bills = recurringBills[0].recurringBills;

    const today = startOfDay(new Date());
    const dueSoonDate = addDays(today, 3);
    const startOfMonthDate = startOfMonth(today);
    const endOfMonthDate = endOfMonth(today);

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
      monthlyTotal: 0,
    };

    for (const bill of bills) {
      const recurrenceDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        bill.recurrenceDay || 1
      );

      if (
        isWithinInterval(recurrenceDate, {
          start: startOfMonthDate,
          end: endOfMonthDate,
        })
      ) {
        result.monthlyTotal += bill.amount;
      }

      if (isBefore(recurrenceDate, today)) {
        result.paid.bills.push(bill);
        result.paid.total += bill.amount;
      } else if (
        isWithinInterval(recurrenceDate, { start: today, end: dueSoonDate })
      ) {
        result.dueSoon.bills.push(bill);
        result.dueSoon.total += bill.amount;
      } else {
        result.upcoming.bills.push(bill);
        result.upcoming.total += bill.amount;
      }
    }

    return res.json({ recurringBills: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}
