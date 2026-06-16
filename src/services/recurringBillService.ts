import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/apiHandler";
import { RecurringBill } from "@prisma/client";
import {
  isBefore,
  startOfDay,
  addDays,
  isWithinInterval,
  endOfMonth,
  startOfMonth,
  addMonths,
  getDate,
  setDate,
} from "date-fns";
import { Prisma } from "@prisma/client";

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
    const next = addMonths(nextDueDate, 1);
    if (isBefore(next, today)) {
      nextDueDate = next;
    } else {
      break;
    }
  }

  return nextDueDate;
}

function calculateNextDueDateAfterPayment(
  referenceDate: Date,
  recurrenceDay: number
): Date {
  let next = setDate(new Date(referenceDate), recurrenceDay);
  next = addMonths(next, 1);
  return next;
}

export type ListRecurringBillsQuery = {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
};

export async function listRecurringBills(
  userId: string,
  query: ListRecurringBillsQuery
) {
  const page = parseInt(query.page ?? "1") || 1;
  const limit = parseInt(query.limit ?? "10") || 10;
  const skip = (page - 1) * limit;

  const searchQuery = query.search ? String(query.search).toLowerCase() : undefined;

  const orderByMap: Record<string, Prisma.RecurringBillOrderByWithRelationInput> = {
    latest: { recurrenceDay: "desc" },
    oldest: { recurrenceDay: "asc" },
    a_to_z: { contactName: "asc" },
    z_to_a: { contactName: "desc" },
    highest: { amount: "desc" },
    lowest: { amount: "asc" },
  };

  const orderBy = orderByMap[query.sortBy ?? ""];

  const allBills = await prisma.recurringBill.findMany({
    where: {
      userId,
      ...(searchQuery && {
        contactName: { contains: searchQuery, mode: "insensitive" },
      }),
    },
    ...(orderBy && { orderBy }),
  });

  const billsWithDueDate = allBills.map((bill) => ({
    ...bill,
    calculatedNextDueDate: calculateNextDueDate(bill),
  }));

  if (!orderBy) {
    billsWithDueDate.sort(
      (a, b) =>
        a.calculatedNextDueDate.getTime() - b.calculatedNextDueDate.getTime()
    );
  }

  const paginatedBills = billsWithDueDate.slice(skip, skip + limit);

  const today = startOfDay(new Date());
  const dueSoonDate = addDays(today, 3);
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  type BillWithStatus = RecurringBill & {
    status: string;
    nextDueDate: Date;
    baseDate: Date;
  };

  const result = {
    overdue: { bills: [] as BillWithStatus[], total: 0 },
    dueSoon: { bills: [] as BillWithStatus[], total: 0 },
    upcoming: { bills: [] as BillWithStatus[], total: 0 },
    monthlyTotal: 0,
    bills: [] as BillWithStatus[],
    pagination: {
      page,
      limit,
      total: allBills.length,
      totalPages: Math.ceil(allBills.length / limit),
    },
  };

  for (const bill of paginatedBills) {
    const nextDueDate = bill.calculatedNextDueDate;

    if (isWithinInterval(nextDueDate, { start: monthStart, end: monthEnd })) {
      result.monthlyTotal += Math.abs(bill.amount);
    }

    let status: string;

    if (isBefore(nextDueDate, today)) {
      status = "overdue";
      result.overdue.bills.push({ ...bill, status, nextDueDate, baseDate: bill.baseDate });
      result.overdue.total += Math.abs(bill.amount);
    } else if (isWithinInterval(nextDueDate, { start: today, end: dueSoonDate })) {
      status = "due soon";
      result.dueSoon.bills.push({ ...bill, status, nextDueDate, baseDate: bill.baseDate });
      result.dueSoon.total += Math.abs(bill.amount);
    } else {
      status = "upcoming";
      result.upcoming.bills.push({ ...bill, status, nextDueDate, baseDate: bill.baseDate });
      result.upcoming.total += Math.abs(bill.amount);
    }

    result.bills.push({ ...bill, status, nextDueDate, baseDate: bill.baseDate });
  }

  return result;
}

export async function updateRecurringBill(
  userId: string,
  billId: string,
  amount: number
) {
  const existing = await prisma.recurringBill.findFirst({
    where: { id: billId, userId },
  });

  if (!existing) throw new ApiError(404, "Recurring bill not found");

  return prisma.recurringBill.update({
    where: { id: billId },
    data: { amount },
  });
}

export async function deleteRecurringBill(userId: string, billId: string) {
  const existing = await prisma.recurringBill.findFirst({
    where: { id: billId, userId },
  });

  if (!existing) throw new ApiError(404, "Recurring bill not found");

  await prisma.recurringBill.delete({ where: { id: billId } });
}

export async function payRecurringBill(
  userId: string,
  billId: string,
  paymentDate?: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  return prisma.$transaction(async (tx) => {
    const bill = await tx.recurringBill.findFirst({
      where: { id: billId, userId, type: "expense" },
    });

    if (!bill) throw new ApiError(404, "Recurring expense not found");

    if (!bill.recurrenceDay || !bill.recurrenceFrequency) {
      throw new ApiError(400, "Recurring expense is missing recurrence information");
    }

    if (bill.amount > (user.currentBalance ?? 0)) {
      throw new ApiError(
        400,
        `Insufficient balance. You need $${bill.amount} but only have $${user.currentBalance ?? 0} available.`
      );
    }

    const paymentDateObj = paymentDate ? new Date(paymentDate) : new Date();

    await tx.user.update({
      where: { id: userId },
      data: { currentBalance: { decrement: bill.amount } },
    });

    const transaction = await tx.transaction.create({
      data: {
        description: bill.description || bill.contactName,
        amount: bill.amount,
        categoryId: bill.categoryId,
        contactName: bill.contactName,
        contactAvatar: bill.contactAvatar,
        type: "expense",
        userId,
        isRecurring: false,
        date: paymentDateObj,
        recurringBillId: bill.id,
        isRecurringGenerated: true,
      },
    });

    const referenceDate = bill.lastPaidDate || bill.baseDate;
    const nextDueDate = calculateNextDueDateAfterPayment(
      referenceDate,
      bill.recurrenceDay
    );

    const updatedBill = await tx.recurringBill.update({
      where: { id: bill.id },
      data: { lastPaidDate: paymentDateObj, nextDueDate },
    });

    return { transaction, bill: updatedBill };
  });
}
