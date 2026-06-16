import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { createTransactionSchema } from "@/validators/transaction";
import {
  listTransactions,
  createTransaction,
} from "@/services/transactionService";

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  if (req.method === "GET") {
    const data = await listTransactions(userId, req.query as Record<string, string>);
    return res.status(200).json({ data });
  }

  if (req.method === "POST") {
    const body = createTransactionSchema.parse(req.body);
    const result = await createTransaction(userId, body);
    return res.status(201).json({
      message: "isRecurring" in result && result.isRecurring
        ? "Recurring bill created successfully!"
        : "Transaction created successfully!",
      ...result,
    });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
});
