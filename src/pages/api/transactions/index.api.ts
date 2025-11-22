import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../auth/[...nextauth].api";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  if (req.method === "GET") {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filterByName = req.query.filterByName as string;
      const sortBy = req.query.sortBy as string;
      const skip = (page - 1) * limit;
      const searchQuery = req.query.search
        ? String(req.query.search).trim()
        : undefined;

      const where: Prisma.TransactionWhereInput = {
        userId: userId,
        ...(searchQuery && {
          OR: [
            {
              description: { contains: searchQuery, mode: "insensitive" },
            },
            {
              contactName: { contains: searchQuery, mode: "insensitive" },
            },
            {
              category: {
                name: { contains: searchQuery, mode: "insensitive" },
              },
            },
          ],
        }),
      };

      if (filterByName && filterByName !== "all") {
        where.category = {
          name: {
            contains: filterByName.trim(),
            mode: "insensitive",
          },
        };
      }

      let orderBy: Prisma.TransactionOrderByWithRelationInput = {
        date: "desc",
      };

      switch (sortBy) {
        case "latest":
          orderBy = { date: "desc" };
          break;
        case "oldest":
          orderBy = { date: "asc" };
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
      }

      const [transactions, totalTransactions] = await Promise.all([
        prisma.transaction.findMany({
          where,
          include: {
            category: true,
            recurringBill: true,
          },
          orderBy,
          skip,
          take: limit,
        }),
        prisma.transaction.count({ where }),
      ]);

      const transactionsWithBalance = transactions.map((transaction) => {
        const balance =
          transaction.type === "income"
            ? "income"
            : transaction.type === "expense"
            ? "expense"
            : "transfer";

        return {
          ...transaction,
          balance,
        };
      });

      const data = {
        transactions: transactionsWithBalance,
        pagination: {
          page,
          limit,
          total: totalTransactions,
          totalPages: Math.ceil(totalTransactions / limit),
        },
      };

      return res.status(200).json({ data });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
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
    } = req.body;

    if (!categoryName || !amount || !contactName || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["income", "expense", "transfer"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    let category = await prisma.category.findUnique({
      where: { name: categoryName },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: categoryName },
      });
    }

    const categoryId = category.id;

    try {
      const transaction = await prisma.transaction.create({
        data: {
          description,
          amount: Math.abs(amount),
          categoryId,
          contactName,
          contactAvatar: contactAvatar || "",
          type,
          userId,
          isRecurring: isRecurring || false,
          date: date ? new Date(date) : new Date(),
        },
      });

      if (isRecurring) {
        if (!recurrenceDay || !recurrenceFrequency) {
          return res.status(400).json({
            message: "Missing recurrence fields for recurring transaction",
          });
        }

        const recurringBill = await prisma.recurringBill.create({
          data: {
            description,
            amount: Math.abs(amount),
            recurrenceDay,
            recurrenceFrequency,
            categoryId,
            contactName,
            contactAvatar: contactAvatar || "",
            type,
            userId,
          },
        });

        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            recurringBillId: recurringBill.id,
            isRecurring: true,
          },
        });
      }

      return res.status(201).json({
        message: "Transaction created successfully",
        transaction,
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
