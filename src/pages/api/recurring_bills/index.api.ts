import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { getServerSession } from "next-auth";
import {
  isBefore,
  startOfDay,
  addDays,
  isWithinInterval,
  endOfMonth,
  startOfMonth,
  addMonths,
  getDate,
} from "date-fns";
import { Prisma, RecurringBill } from "@prisma/client";

export function calculateNextDueDate(bill: RecurringBill): Date {
  const today = startOfDay(new Date());

  if (bill.nextDueDate && isBefore(today, bill.nextDueDate)) {
    return bill.nextDueDate;
  }

  const baseDate = bill.lastPaidDate || bill.baseDate;
  const dueDay = bill.recurrenceDay || getDate(baseDate);

  let nextDueDate = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    dueDay
  );

  if (isBefore(nextDueDate, baseDate)) {
    nextDueDate = addMonths(nextDueDate, 1);
  }

  while (isBefore(nextDueDate, today)) {
    const nextCandidate = addMonths(nextDueDate, 1);
    if (isBefore(nextCandidate, today)) {
      nextDueDate = nextCandidate;
    } else {
      break;
    }
  }

  return nextDueDate;
}

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

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  let searchQuery;
  let orderBy: Prisma.RecurringBillOrderByWithRelationInput = {};

  if (req.query.search && req.query.search !== "") {
    searchQuery = String(req.query.search).toLowerCase();
  }

  switch (req.query.sortBy) {
    case "latest":
      orderBy = { recurrenceDay: "desc" };
      break;
    case "oldest":
      orderBy = { recurrenceDay: "asc" };
      break;
    case "a_to_z":
      orderBy = { contactName: "asc" };
      break;
    case "z_to_a":
      orderBy = { contactName: "desc" };
      break;
    case "highest":
      orderBy = { amount: "desc" };
      break;
    case "lowest":
      orderBy = { amount: "asc" };
      break;
    default:
      orderBy = { recurrenceDay: "desc" };
  }

  try {
    const recurringBills = await prisma.recurringBill.findMany({
      where: {
        userId: String(userId),
        ...(searchQuery && {
          contactName: {
            contains: searchQuery,
            mode: "insensitive",
          },
        }),
      },
      orderBy,
      skip,
      take: limit,
    });

    const totalTransactions = await prisma.recurringBill.count({
      where: {
        userId: String(userId),
        ...(searchQuery && {
          contactName: {
            contains: searchQuery,
            mode: "insensitive",
          },
        }),
      },
    });

    if (recurringBills.length === 0) {
      return res.status(404).json({ message: "No recurring bills found" });
    }

    const today = startOfDay(new Date());
    const dueSoonDate = addDays(today, 3);
    const startOfMonthDate = startOfMonth(today);
    const endOfMonthDate = endOfMonth(today);

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
      bills: [] as (RecurringBill & {
        status: string;
        nextDueDate: Date;
        baseDate: Date;
      })[],
      pagination: {
        page,
        limit,
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
      },
    };

    for (const bill of recurringBills) {
      const nextDueDate = calculateNextDueDate(bill);

      if (
        isWithinInterval(nextDueDate, {
          start: startOfMonthDate,
          end: endOfMonthDate,
        })
      ) {
        result.monthlyTotal += Math.abs(bill.amount);
      }

      let status = "upcoming";

      if (isBefore(nextDueDate, today)) {
        status = "overdue";
        result.overdue.bills.push({
          ...bill,
          nextDueDate,
          baseDate: bill.baseDate,
        });
        result.overdue.total += Math.abs(bill.amount);
      } else if (
        isWithinInterval(nextDueDate, { start: today, end: dueSoonDate })
      ) {
        status = "due soon";
        result.dueSoon.bills.push({
          ...bill,
          nextDueDate,
          baseDate: bill.baseDate,
        });
        result.dueSoon.total += Math.abs(bill.amount);
      } else {
        status = "upcoming";
        result.upcoming.bills.push({
          ...bill,
          nextDueDate,
          baseDate: bill.baseDate,
        });
        result.upcoming.total += Math.abs(bill.amount);
      }

      result.bills.push({
        ...bill,
        status,
        nextDueDate,
        baseDate: bill.baseDate,
      });
    }

    return res.json({ recurringBills: result });
  } catch (error) {
    console.error("Error fetching recurring bills:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
}
