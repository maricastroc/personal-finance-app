import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { listPots } from "@/services/potService";
import { listBudgets } from "@/services/budgetService";
import { listRecurringBills } from "@/services/recurringBillService";
import { listLatestTransactions } from "@/services/transactionService";

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const [potsData, budgets, recurringBills, transactions] = await Promise.all(
      [
        listPots(userId),
        listBudgets(userId),
        listRecurringBills(userId, {}),
        listLatestTransactions(userId),
      ]
    );

    return res
      .status(200)
      .json({ summary: { potsData, budgets, recurringBills, transactions } });
  }
);
