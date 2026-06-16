import { NextApiRequest, NextApiResponse } from "next";
import { withApiHandler } from "@/lib/apiHandler";
import { updatePotSchema } from "@/validators/pot";
import { getPot, updatePot, deletePot } from "@/services/potService";

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  const potId = String(req.query.potId);

  if (req.method === "GET") {
    const potWithDetails = await getPot(userId, potId);
    return res.status(200).json({ potWithDetails });
  }

  if (req.method === "PUT") {
    const body = updatePotSchema.parse(req.body);
    const result = await updatePot(userId, potId, body);
    return res.status(200).json({ ...result, message: "Pot updated successfully!" });
  }

  if (req.method === "DELETE") {
    const result = await deletePot(userId, potId);
    return res.status(200).json({ message: "Pot deleted successfully!", ...result });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
});
