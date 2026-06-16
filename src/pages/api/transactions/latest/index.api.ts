import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { listLatestTransactions } from "@/services/transactionService";

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
    if (req.method !== "GET") return res.status(405).end();

    const transactions = await listLatestTransactions(userId);
    return res.status(200).json({ transactions });
  }
);
