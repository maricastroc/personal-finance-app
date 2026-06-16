import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { createBudgetSchema } from "@/validators/budget";
import { listBudgets, createBudget } from "@/services/budgetService";

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
    if (req.method === "GET") {
      const budgets = await listBudgets(userId);
      return res.status(200).json({ budgets });
    }

    if (req.method === "POST") {
      const body = createBudgetSchema.parse(req.body);
      const budget = await createBudget(userId, body);
      return res
        .status(201)
        .json({ budget, message: "Budget created successfully!" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  }
);
