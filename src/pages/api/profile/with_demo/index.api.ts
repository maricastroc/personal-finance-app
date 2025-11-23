/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { ALLOWED_MIME_TYPES, MAX_AVATAR_SIZE } from "@/utils/constants";
import { getDefaultTransactions } from "@/utils/getDefaultTransactions";
import { getDefaultBudgets } from "@/utils/getDefaultBudgets";
import { getDefaultPots } from "@/utils/getDefaultPots";
import { getDefaultBills } from "@/utils/getDefaultBills";

let fs: any, path: any;

try {
  if (typeof process !== "undefined" && process.versions?.node) {
    fs = require("fs");
    path = require("path");
  }
} catch (e) {
  console.warn("File system operations not available in this environment:", e);
}

export const config = {
  api: {
    bodyParser: false,
    runtime: "nodejs",
  },
};

const getSingleString = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }
  if (typeof value === "string") {
    return value;
  }
  return undefined;
};

const handleAvatarUpload = async (file: any) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error("Apenas imagens JPEG, PNG ou WebP são permitidas");
  }

  const fileContent = await fs.promises.readFile(file.filepath);

  if (fileContent.length > MAX_AVATAR_SIZE) {
    await fs.promises.unlink(file.filepath);
    throw new Error("A imagem deve ter no máximo 2MB");
  }

  const base64Image = fileContent.toString("base64");
  const dataURI = `data:${file.mimetype};base64,${base64Image}`;

  await fs.promises.unlink(file.filepath);

  return dataURI;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error processing form" });
      }

      try {
        const createUserSchema = z.object({
          name: z.string().min(3, "Name must have at least 3 characters"),
          email: z.string().email("Invalid email").min(1, "Email is required"),
          password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
              /[a-z]/,
              "Password must contain at least one lowercase letter"
            )
            .regex(/[0-9]/, "Password must contain at least one number")
            .min(1, "Password is required"),
          currentBalance: z
            .string()
            .transform((value) => (value ? parseFloat(value) : 0))
            .optional(),
        });

        const validatedFields = await createUserSchema.parseAsync({
          name: fields.name ? getSingleString(fields.name) : undefined,
          email: fields.email ? getSingleString(fields.email) : undefined,
          password: fields.password
            ? getSingleString(fields.password)
            : undefined,
          currentBalance: fields.currentBalance
            ? getSingleString(fields.currentBalance)
            : undefined,
          avatarUrl: files.avatarUrl?.[0],
        });

        const existingUser = await prisma.user.findUnique({
          where: { email: validatedFields.email },
        });

        if (existingUser) {
          return res.status(400).json({ message: "Email is already in use" });
        }

        const hashedPassword = await bcrypt.hash(validatedFields.password, 10);

        let avatarUrl: string | undefined;

        if (files.avatarUrl) {
          const avatarFile = Array.isArray(files.avatarUrl)
            ? files.avatarUrl[0]
            : files.avatarUrl;

          avatarUrl = await handleAvatarUpload(avatarFile);
        }

        const dbData: any = {
          ...validatedFields,
          password: hashedPassword,
          ...(avatarUrl && { avatarUrl }),
        };

        const result = await prisma.$transaction(async (tx) => {
          const createdUser = await tx.user.create({ data: dbData });

          await tx.transaction.createMany({
            data: getDefaultTransactions(createdUser as any),
          });
          await tx.budget.createMany({
            data: getDefaultBudgets(createdUser as any),
          });
          await tx.pot.createMany({ data: getDefaultPots(createdUser as any) });
          await tx.recurringBill.createMany({
            data: getDefaultBills(createdUser as any),
          });

          return createdUser;
        });

        return res.status(201).json({
          user: result,
          message: "User successfully created!",
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ message: error.errors[0].message });
        } else if (error instanceof Error) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
      }
    });
  } else {
    res.status(405).end();
  }
}
