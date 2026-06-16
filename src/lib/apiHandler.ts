import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { buildNextAuthOptions } from "@/pages/api/auth/[...nextauth].api";

type AuthenticatedHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<void | NextApiResponse<any>>;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function withApiHandler(handler: AuthenticatedHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res)
    );

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session?.user?.id?.toString();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      await handler(req, res, userId);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error instanceof ApiError) {
        return res.status(error.status).json({ message: error.message });
      }
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
