import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { updateRecurringBillSchema } from "@/validators/recurringBill";
import {
  updateRecurringBill,
  deleteRecurringBill,
} from "@/services/recurringBillService";

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const billId = String(req.query.id);

  if (req.method === "PUT") {
    const { amount } = updateRecurringBillSchema.parse(req.body);
    const bill = await updateRecurringBill(userId, billId, amount);
    return res.status(200).json({ message: "Recurring bill updated successfully!", bill });
  }

  if (req.method === "DELETE") {
    await deleteRecurringBill(userId, billId);
    return res.status(200).json({ message: "Recurring bill deleted successfully!" });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
});
