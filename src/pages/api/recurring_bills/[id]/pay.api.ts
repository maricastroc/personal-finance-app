import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../../auth/[...nextauth].api";
import { addMonths, setDate } from "date-fns";

function calculateNextDueDate(baseDate: Date, recurrenceDay: number): Date {
  let nextDueDate = new Date(baseDate);

  nextDueDate = setDate(nextDueDate, recurrenceDay);
  nextDueDate = addMonths(nextDueDate, 1);

  return nextDueDate;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res)
  );

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = String(session.user.id);
  const { id: billId } = req.query;
  const { paymentDate } = req.body;

  if (!billId) {
    return res.status(400).json({ message: "Bill ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const result = await prisma.$transaction(async (tx) => {
      const bill = await tx.recurringBill.findFirst({
        where: {
          id: String(billId),
          userId,
        },
      });

      if (!bill) {
        throw new Error("Recurring bill not found");
      }

      if (!bill.recurrenceDay || !bill.recurrenceFrequency) {
        throw new Error("Recurring bill missing recurrence information");
      }

      if (bill.type === "expense") {
        if (bill.amount > (user.currentBalance || 0)) {
          throw new Error("Insufficient funds to pay this bill");
        }
      }

      const paymentDateObj = paymentDate ? new Date(paymentDate) : new Date();

      if (bill.type === "expense") {
        await tx.user.update({
          where: { id: user.id },
          data: {
            currentBalance: {
              decrement: bill.amount,
            },
          },
        });
      }

      const transaction = await tx.transaction.create({
        data: {
          description: bill.description || bill.contactName,
          amount: bill.amount,
          categoryId: bill.categoryId,
          contactName: bill.contactName,
          contactAvatar: bill.contactAvatar,
          type: bill.type,
          userId,
          isRecurring: false,
          date: paymentDateObj,
          recurringBillId: bill.id,
        },
      });

      const referenceDate = bill.lastPaidDate || bill.baseDate;

      const nextDueDate = calculateNextDueDate(
        referenceDate,
        bill.recurrenceDay
      );

      const updatedBill = await tx.recurringBill.update({
        where: { id: bill.id },
        data: {
          lastPaidDate: paymentDateObj,
          nextDueDate,
        },
      });

      return { transaction, bill: updatedBill };
    });

    return res.status(200).json({
      message: "Bill paid successfully",
      ...result,
    });
  } catch (error) {
    console.error("Error paying bill:", error);

    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      if (error.message.includes("missing recurrence information")) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message.includes("Insufficient funds")) {
        return res.status(400).json({
          message:
            "Insufficient funds. You don't have enough balance to pay this bill.",
        });
      }
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
