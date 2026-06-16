import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/apiHandler";
import { Prisma } from "@prisma/client";
import { addMonths, isBefore, setDate } from "date-fns";
import { z } from "zod";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/validators/transaction";

function calculateNextDueDate(baseDate: Date, recurrenceDay: number): Date {
  const today = new Date();
  let nextDueDate = setDate(new Date(baseDate), recurrenceDay);

  if (isBefore(nextDueDate, today)) {
    nextDueDate = addMonths(nextDueDate, 1);
  }

  return nextDueDate;
}

async function findOrCreateCategory(name: string) {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) return existing;
  return prisma.category.create({ data: { name } });
}

export type ListTransactionsQuery = {
  page?: string;
  limit?: string;
  search?: string;
  filterByName?: string;
  sortBy?: string;
};

export async function listTransactions(
  userId: string,
  query: ListTransactionsQuery
) {
  const page = parseInt(query.page ?? "1") || 1;
  const limit = parseInt(query.limit ?? "10") || 10;
  const skip = (page - 1) * limit;
  const searchQuery = query.search ? String(query.search).trim() : undefined;

  const where: Prisma.TransactionWhereInput = {
    userId,
    ...(searchQuery && {
      OR: [
        { description: { contains: searchQuery, mode: "insensitive" } },
        { contactName: { contains: searchQuery, mode: "insensitive" } },
        { category: { name: { contains: searchQuery, mode: "insensitive" } } },
      ],
    }),
  };

  if (query.filterByName && query.filterByName !== "all") {
    where.category = {
      name: { contains: query.filterByName.trim(), mode: "insensitive" },
    };
  }

  const orderByMap: Record<string, Prisma.TransactionOrderByWithRelationInput> =
    {
      latest: { date: "desc" },
      oldest: { date: "asc" },
      a_to_z: { contactName: "asc" },
      z_to_a: { contactName: "desc" },
      highest: { amount: "desc" },
      lowest: { amount: "asc" },
    };

  const orderBy = orderByMap[query.sortBy ?? ""] ?? { date: "desc" };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true, recurringBill: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions: transactions.map((t) => ({ ...t, balance: t.type })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function listLatestTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
    take: 5,
  });

  return transactions.map((t) => ({ ...t, balance: t.type }));
}

export async function createTransaction(
  userId: string,
  body: z.infer<typeof createTransactionSchema>
) {
  const {
    description,
    amount,
    categoryName,
    contactName,
    contactAvatar,
    type,
    isRecurring,
    recurrenceDay,
    recurrenceFrequency,
    date,
  } = body;

  const transactionDate = date ? new Date(date) : new Date();
  const todayStr = new Date().toISOString().split("T")[0];
  const dateStr = date ?? todayStr;

  if (dateStr < todayStr) {
    throw new ApiError(
      400,
      "Cannot create transactions with past dates. Please use today's date or a future date."
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  if (type === "expense" && Math.abs(amount) > (user.currentBalance ?? 0)) {
    throw new ApiError(
      400,
      "Insufficient funds. You don't have enough balance to cover this expense."
    );
  }

  const category = await findOrCreateCategory(categoryName);

  return prisma.$transaction(async (tx) => {
    if (isRecurring) {
      if (!recurrenceDay || !recurrenceFrequency) {
        throw new ApiError(
          400,
          "Missing recurrence fields for recurring transaction"
        );
      }

      const nextDueDate = calculateNextDueDate(transactionDate, recurrenceDay);

      const recurringBill = await tx.recurringBill.create({
        data: {
          description,
          amount: Math.abs(amount),
          recurrenceDay,
          recurrenceFrequency,
          categoryId: category.id,
          contactName,
          contactAvatar: contactAvatar ?? "",
          type,
          userId,
          baseDate: transactionDate,
          nextDueDate,
          lastPaidDate: null,
        },
      });

      return { recurringBill };
    }

    if (type === "expense") {
      await tx.user.update({
        where: { id: userId },
        data: { currentBalance: { decrement: Math.abs(amount) } },
      });
    } else if (type === "income") {
      await tx.user.update({
        where: { id: userId },
        data: { currentBalance: { increment: Math.abs(amount) } },
      });
    }

    const transaction = await tx.transaction.create({
      data: {
        description,
        amount: Math.abs(amount),
        categoryId: category.id,
        contactName,
        contactAvatar: contactAvatar ?? "",
        type,
        userId,
        isRecurring: false,
        date: transactionDate,
        recurringBillId: null,
      },
    });

    return { transaction };
  });
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  body: z.infer<typeof updateTransactionSchema>
) {
  const { description, amount, categoryName, contactName, contactAvatar, type, date } =
    body;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
    include: { recurringBill: true },
  });

  if (!existing) throw new ApiError(404, "Transaction not found");

  if (existing.recurringBillId || existing.isRecurringGenerated || existing.isRecurring) {
    throw new ApiError(
      400,
      "Cannot edit transactions created via 'Pay Now'. These payments are linked to recurring bills."
    );
  }

  if (type === "expense") {
    const diff = Math.abs(amount) - existing.amount;
    if (diff > 0 && diff > (user.currentBalance ?? 0)) {
      throw new ApiError(
        400,
        "Insufficient funds. You don't have enough balance to cover this expense."
      );
    }
  }

  if (date) {
    const newDate = new Date(date);
    const originalDate = new Date(existing.date);
    if (newDate < originalDate) {
      throw new ApiError(
        400,
        "Cannot change transaction date to a date earlier than the original transaction date."
      );
    }
  }

  const category = await findOrCreateCategory(categoryName);

  const amountDiff = Math.abs(amount) - existing.amount;

  if (amountDiff !== 0) {
    if (type === "expense") {
      await prisma.user.update({
        where: { id: userId },
        data: { currentBalance: { decrement: amountDiff } },
      });
    } else if (type === "income") {
      await prisma.user.update({
        where: { id: userId },
        data: { currentBalance: { increment: amountDiff } },
      });
    }
  }

  return prisma.transaction.update({
    where: { id: transactionId },
    data: {
      description,
      amount: Math.abs(amount),
      categoryId: category.id,
      contactName,
      contactAvatar: contactAvatar ?? "",
      type,
      date: date ? new Date(date) : new Date(),
      isRecurring: false,
    },
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
    include: { recurringBill: true },
  });

  if (!existing) throw new ApiError(404, "Transaction not found");

  if (existing.recurringBillId || existing.isRecurring) {
    throw new ApiError(
      400,
      "Cannot delete transactions created via 'Pay Now'. These payments are linked to recurring bills."
    );
  }

  if (existing.type === "expense") {
    await prisma.user.update({
      where: { id: userId },
      data: { currentBalance: { increment: existing.amount } },
    });
  } else if (existing.type === "income") {
    await prisma.user.update({
      where: { id: userId },
      data: { currentBalance: { decrement: existing.amount } },
    });
  }

  await prisma.transaction.delete({ where: { id: transactionId } });
}
