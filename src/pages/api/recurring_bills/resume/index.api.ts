import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { prisma } from "@/lib/prisma";
import { RecurringBill } from "@prisma/client";
import { isBefore, startOfDay, addDays, isWithinInterval } from "date-fns";
import { calculateNextDueDate } from "@/services/recurringBillService";

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
    if (req.method !== "GET") return res.status(405).end();

    const recurringBills = await prisma.recurringBill.findMany({
      where: { userId },
      include: { category: true },
    });

    if (recurringBills.length === 0) {
      return res.status(404).json({ message: "No recurring bills found" });
    }

    const today = startOfDay(new Date());
    const dueSoonDate = addDays(today, 3);

    type BillEntry = RecurringBill & { nextDueDate: Date; baseDate: Date };

    const result = {
      overdue: { bills: [] as BillEntry[], total: 0 },
      dueSoon: { bills: [] as BillEntry[], total: 0 },
      upcoming: { bills: [] as BillEntry[], total: 0 },
      monthlyTotal: recurringBills.reduce(
        (sum, b) => sum + Math.abs(b.amount),
        0
      ),
    };

    for (const bill of recurringBills) {
      const nextDueDate = calculateNextDueDate(bill);
      const entry = { ...bill, nextDueDate, baseDate: bill.baseDate };

      if (isBefore(nextDueDate, today)) {
        result.overdue.bills.push(entry);
        result.overdue.total += Math.abs(bill.amount);
      } else if (
        isWithinInterval(nextDueDate, { start: today, end: dueSoonDate })
      ) {
        result.dueSoon.bills.push(entry);
        result.dueSoon.total += Math.abs(bill.amount);
      } else {
        result.upcoming.bills.push(entry);
        result.upcoming.total += Math.abs(bill.amount);
      }
    }

    return res.status(200).json({ recurringBills: result });
  }
);
