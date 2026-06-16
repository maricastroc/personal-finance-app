import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { listRecurringBills } from "@/services/recurringBillService";

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  if (req.method !== "GET") return res.status(405).end();

  const recurringBills = await listRecurringBills(
    userId,
    req.query as Record<string, string>
  );

  return res.status(200).json({ recurringBills });
});
