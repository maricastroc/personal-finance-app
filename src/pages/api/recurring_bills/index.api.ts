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
} from "date-fns";
import { Prisma, RecurringBill } from "@prisma/client";

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
    const recurringBills = await prisma.user.findMany({
      where: { id: String(userId) },
      include: {
        recurringBills: {
          where: {
            contactName: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          orderBy,
          skip,
          take: limit,
        },
      },
    });

    const totalTransactions = await prisma.recurringBill.count({
      where: {
        userId: String(userId),
        contactName: {
          contains: searchQuery,
          mode: "insensitive",
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
      allBills: [] as (RecurringBill & { status: string })[],
      pagination: {
        page,
        limit,
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
      },
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

      let status = "upcoming";

      if (isBefore(recurrenceDate, today)) {
        status = "paid";
        result.paid.bills.push(bill);
        result.paid.total += bill.amount;
      } else if (
        isWithinInterval(recurrenceDate, { start: today, end: dueSoonDate })
      ) {
        status = "due soon";
        result.dueSoon.bills.push(bill);
        result.dueSoon.total += bill.amount;
      } else {
        result.upcoming.bills.push(bill);
        result.upcoming.total += bill.amount;
      }

      result.allBills.push({ ...bill, status });
    }

    return res.json({ recurringBills: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}
