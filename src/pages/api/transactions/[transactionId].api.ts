import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { updateTransactionSchema } from "@/validators/transaction";
import {
  updateTransaction,
  deleteTransaction,
} from "@/services/transactionService";

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const transactionId = String(req.query.transactionId);

  if (req.method === "PUT") {
    const body = updateTransactionSchema.parse(req.body);
    const transaction = await updateTransaction(userId, transactionId, body);
    return res.status(200).json({ message: "Transaction updated successfully!", transaction });
  }

  if (req.method === "DELETE") {
    await deleteTransaction(userId, transactionId);
    return res.status(200).json({ message: "Transaction deleted successfully!" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
});
