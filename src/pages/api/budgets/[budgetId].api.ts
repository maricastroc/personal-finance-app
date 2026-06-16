import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { updateBudgetSchema } from "@/validators/budget";
import {
  getBudget,
  updateBudget,
  deleteBudget,
} from "@/services/budgetService";

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const budgetId = String(req.query.budgetId);

  if (req.method === "GET") {
    const budget = await getBudget(userId, budgetId);
    return res.status(200).json({ budget });
  }

  if (req.method === "PUT") {
    const body = updateBudgetSchema.parse(req.body);
    const budget = await updateBudget(userId, budgetId, body);
    return res.status(200).json({ budget, message: "Budget updated successfully!" });
  }

  if (req.method === "DELETE") {
    await deleteBudget(userId, budgetId);
    return res.status(200).json({ message: "Budget deleted successfully!" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
});
