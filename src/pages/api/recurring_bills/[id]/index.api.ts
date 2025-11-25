import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { buildNextAuthOptions } from "../../auth/[...nextauth].api";

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
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session?.user?.id?.toString();

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (req.method === "PUT") {
    try {
      const { id } = req.query;
      const { amount } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Bill ID is required" });
      }

      if (amount === undefined) {
        return res.status(400).json({ message: "Amount is required" });
      }

      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
          message: "Amount must be a positive number",
        });
      }

      const existingBill = await prisma.recurringBill.findFirst({
        where: {
          id: String(id),
          userId: String(userId),
        },
      });

      if (!existingBill) {
        return res.status(404).json({ message: "Recurring bill not found" });
      }

      const updatedBill = await prisma.recurringBill.update({
        where: {
          id: String(id),
        },
        data: {
          amount: amount,
        },
      });

      return res.status(200).json({
        message: "Recurring bill updated successfully",
        bill: updatedBill,
      });
    } catch (error) {
      console.error("Error updating recurring bill:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else if (req.method === "DELETE") {
    try {
      const userId = session?.user?.id?.toString();
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: "Bill ID is required" });
      }

      const existingBill = await prisma.recurringBill.findFirst({
        where: {
          id: String(id),
          userId: String(userId),
        },
      });

      if (!existingBill) {
        return res.status(404).json({ message: "Recurring bill not found" });
      }

      await prisma.recurringBill.delete({
        where: {
          id: String(id),
        },
      });

      return res.status(200).json({
        message: "Recurring bill deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting recurring bill:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
