import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { payRecurringBillSchema } from "@/validators/recurringBill";
import { payRecurringBill } from "@/services/recurringBillService";

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  if (req.method !== "POST") return res.status(405).end();

  const billId = String(req.query.id);
  const { paymentDate } = payRecurringBillSchema.parse(req.body);

  const result = await payRecurringBill(userId, billId, paymentDate);

  return res.status(200).json({
    message: "Recurring Bill paid successfully!",
    ...result,
  });
});
