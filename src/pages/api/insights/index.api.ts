import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { getInsights } from "@/services/insightsService";
import { startOfMonth, subMonths, parseISO, isValid } from "date-fns";

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const defaultFrom = startOfMonth(subMonths(new Date(), 5));
    const defaultTo = new Date();

    const from = req.query.from
      ? parseISO(String(req.query.from))
      : defaultFrom;
    const to = req.query.to ? parseISO(String(req.query.to)) : defaultTo;

    const insights = await getInsights(userId, {
      from: isValid(from) ? from : defaultFrom,
      to: isValid(to) ? to : defaultTo,
    });

    return res.status(200).json({ insights });
  }
);
