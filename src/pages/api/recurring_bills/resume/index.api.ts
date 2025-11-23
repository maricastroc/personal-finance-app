import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { isBefore, startOfDay, addDays, isWithinInterval } from "date-fns";
import { RecurringBill } from "@prisma/client";
import { buildNextAuthOptions } from "../../auth/[...nextauth].api";
import { calculateNextDueDate } from "../index.api";

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
    const recurringBills = await prisma.recurringBill.findMany({
      where: {
        userId: String(userId),
      },
      include: {
        category: true,
      },
    });

    if (recurringBills.length === 0) {
      return res.status(404).json({ message: "No recurring bills found" });
    }

    const today = startOfDay(new Date());
    const dueSoonDate = addDays(today, 3);

    const result = {
      overdue: {
        bills: [] as (RecurringBill & { nextDueDate: Date; baseDate: Date })[],
        total: 0,
      },
      dueSoon: {
        bills: [] as (RecurringBill & { nextDueDate: Date; baseDate: Date })[],
        total: 0,
      },
      upcoming: {
        bills: [] as (RecurringBill & { nextDueDate: Date; baseDate: Date })[],
        total: 0,
      },
      monthlyTotal: 0,
    };

    for (const bill of recurringBills) {
      result.monthlyTotal += Math.abs(bill.amount);
    }

    for (const bill of recurringBills) {
      const nextDueDate = calculateNextDueDate(bill);

      if (isBefore(nextDueDate, today)) {
        result.overdue.bills.push({
          ...bill,
          nextDueDate,
          baseDate: bill.baseDate,
        });
        result.overdue.total += Math.abs(bill.amount);
      } else if (
        isWithinInterval(nextDueDate, { start: today, end: dueSoonDate })
      ) {
        result.dueSoon.bills.push({
          ...bill,
          nextDueDate,
          baseDate: bill.baseDate,
        });
        result.dueSoon.total += Math.abs(bill.amount);
      } else {
        result.upcoming.bills.push({
          ...bill,
          nextDueDate,
          baseDate: bill.baseDate,
        });
        result.upcoming.total += Math.abs(bill.amount);
      }
    }

    return res.json({ recurringBills: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}
