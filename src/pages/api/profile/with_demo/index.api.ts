/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingForm } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { getDefaultTransactions } from "@/utils/getDefaultTransactions";
import { getDefaultBudgets } from "@/utils/getDefaultBudgets";
import { getDefaultPots } from "@/utils/getDefaultPots";
import { getDefaultBills } from "@/utils/getDefaultBills";

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

// Função para calcular o balance baseado nos dados padrão
const calculateBalanceFromDefaults = () => {
  // Obter os dados padrão
  const dummyUser = { id: "temp" } as any;
  const defaultTransactions = getDefaultTransactions(dummyUser);
  const defaultPots = getDefaultPots(dummyUser);

  // Calcular income e expense das transações padrão
  let totalIncome = 0;
  let totalExpense = 0;

  defaultTransactions.forEach((transaction: any) => {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      totalExpense += transaction.amount;
    }
  });

  // Calcular total em pots
  const totalInPots = defaultPots.reduce(
    (sum: number, pot: any) => sum + (pot.currentAmount || 0),
    0
  );

  // Calcular currentBalance: income - expense - pots
  const calculatedBalance = totalIncome - totalExpense - totalInPots;

  return {
    calculatedBalance,
    totalIncome,
    totalExpense,
    totalInPots,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new IncomingForm();

    form.parse(req, async (err, fields) => {
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
        });

        const existingUser = await prisma.user.findUnique({
          where: { email: validatedFields.email },
        });

        if (existingUser) {
          return res.status(400).json({ message: "Email is already in use" });
        }

        const hashedPassword = await bcrypt.hash(validatedFields.password, 10);

        // Calcular o balance ANTES de criar a transaction
        const balanceData = calculateBalanceFromDefaults();

        const dbData: any = {
          ...validatedFields,
          password: hashedPassword,
          currentBalance: balanceData.calculatedBalance, // Já definir o balance correto
        };

        const result = await prisma.$transaction(async (tx) => {
          const createdUser = await tx.user.create({ data: dbData });

          // Criar as entradas padrão
          await tx.transaction.createMany({
            data: getDefaultTransactions(createdUser as any),
          });
          await tx.budget.createMany({
            data: getDefaultBudgets(createdUser as any),
          });
          await tx.pot.createMany({
            data: getDefaultPots(createdUser as any),
          });
          await tx.recurringBill.createMany({
            data: getDefaultBills(createdUser as any),
          });

          return {
            user: createdUser,
            balanceData,
          };
        });

        return res.status(201).json({
          user: result.user,
          balanceData: result.balanceData,
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
