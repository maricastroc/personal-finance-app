import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { createPotSchema } from "@/validators/pot";
import { listPots, createPot } from "@/services/potService";

export default withApiHandler(
  async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
    if (req.method === "GET") {
      const data = await listPots(userId);
      return res.status(200).json({ data });
    }

    if (req.method === "POST") {
      const body = createPotSchema.parse(req.body);
      const pot = await createPot(userId, body);
      return res
        .status(200)
        .json({ pot, message: "Pot created successfully!" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  }
);
