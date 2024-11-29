import { IncomingForm } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const config = {
  api: {
    bodyParser: false,
  },
}

const getSingleString = (
  value: string | string[] | undefined,
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0]
  }
  if (typeof value === 'string') {
    return value
  }
  return undefined
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const form = new IncomingForm()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error processing form' })
      }

      try {
        const createUserSchema = z.object({
          name: z.string().min(3, 'Name is required'),
          email: z.string().email('Invalid email').min(1, 'Email is required'),
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
              /[a-z]/,
              'Password must contain at least one lowercase letter',
            )
            .regex(/[0-9]/, 'Password must contain at least one number')
            .min(1, 'Password is required'),
          initialBalance: z
            .string()
            .transform((value) => (value ? parseFloat(value) : 0))
            .optional(),
        })

        const validatedFields = await createUserSchema.parseAsync({
          name: fields.name ? getSingleString(fields.name) : undefined,
          email: fields.email ? getSingleString(fields.email) : undefined,
          password: fields.password
            ? getSingleString(fields.password)
            : undefined,
          initialBalance: fields.initialBalance
            ? getSingleString(fields.initialBalance)
            : undefined,
          avatarUrl: files.avatarUrl?.[0],
        })

        const existingUser = await prisma.user.findUnique({
          where: { email: validatedFields.email },
        })

        if (existingUser) {
          return res.status(400).json({ message: 'Email is already in use' })
        }

        const hashedPassword = await bcrypt.hash(validatedFields.password, 10)

        let avatarUrl = null

        if (files.avatarUrl) {
          const avatarFile = Array.isArray(files.avatarUrl)
            ? files.avatarUrl[0]
            : files.avatarUrl
          const avatarPath = path.join(
            process.cwd(),
            'public',
            'assets',
            'images',
            'avatars',
            avatarFile.originalFilename ?? '',
          )
          fs.renameSync(avatarFile.filepath, avatarPath)
          avatarUrl = `/assets/images/avatars/${avatarFile.originalFilename}`
        }

        const newUser = await prisma.$transaction(async (prisma) => {
          const createdUser = await prisma.user.create({
            data: {
              name: validatedFields.name,
              email: validatedFields.email,
              password: hashedPassword,
              initialBalance: validatedFields.initialBalance ?? 0,
              avatarUrl: avatarUrl ?? null,
            },
          })

          const transactions = [
            {
              description: '',
              amount: 30,
              date: '2024-08-03T14:00:37.000Z',
              isRecurring: true,
              categoryId: '6bb2b046-de5a-4928-aa6d-81545793d5f3',
              senderId: createdUser.accountId,
              recipientId: 'e18a091d-bee3-469e-bb7f-fabdd437c6cf',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 38.5,
              date: '2024-07-18T19:20:23.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: createdUser.accountId,
              recipientId: '5bef1ac4-06f2-48c2-8355-e593a24ab533',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 50,
              date: '2024-08-04T11:15:22.000Z',
              isRecurring: false,
              categoryId: 'd9afe042-0c60-41b7-a80f-7a4e7c5c5de8',
              senderId: createdUser.accountId,
              recipientId: '349916ed-9a92-42c0-9c0f-191d6a674163',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 95.5,
              date: '2024-07-12T13:40:46.000Z',
              isRecurring: false,
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              senderId: createdUser.accountId,
              recipientId: '028ec2c3-516a-4119-851d-cf516225cdb7',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 120,
              date: '2024-08-17T16:12:05.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: '5bef1ac4-06f2-48c2-8355-e593a24ab533',
              recipientId: createdUser.accountId,
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 33.75,
              date: '2024-07-11T18:05:59.000Z',
              isRecurring: false,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              senderId: createdUser.accountId,
              recipientId: '95a44029-2e8f-45d8-a15c-4f2f0e69e170',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 100,
              date: '2024-08-02T09:25:11.000Z',
              isRecurring: true,
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              senderId: createdUser.accountId,
              recipientId: '553f5bf4-4273-4dd8-b41f-d3ae75297c8c',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 20.5,
              date: '2024-07-07T11:45:55.000Z',
              isRecurring: false,
              categoryId: '36619eef-9c0b-4194-9cbc-431c959a98bb',
              senderId: createdUser.accountId,
              recipientId: 'a1321101-c4db-4c4e-ad17-d25b552c4876',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 6.75,
              date: '2024-08-05T14:30:56.000Z',
              isRecurring: false,
              categoryId: '6bb2b046-de5a-4928-aa6d-81545793d5f3',
              senderId: createdUser.accountId,
              recipientId: '8d294ff9-e359-47e9-a43b-172c215f3f1f',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 100,
              date: '2024-07-02T09:25:51.000Z',
              isRecurring: true,
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              senderId: createdUser.accountId,
              recipientId: '553f5bf4-4273-4dd8-b41f-d3ae75297c8c',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 12.5,
              date: '2024-07-09T08:55:27.000Z',
              isRecurring: false,
              categoryId: '36619eef-9c0b-4194-9cbc-431c959a98bb',
              senderId: createdUser.accountId,
              recipientId: 'a50413e9-ed17-40ba-9a06-d07450df7e73',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 9.99,
              date: '2024-07-21T10:05:42.000Z',
              isRecurring: true,
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              senderId: createdUser.accountId,
              recipientId: '60663bb3-24ca-4da5-a64c-c369078180f1',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 3428,
              date: '2024-07-26T14:40:23.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: '8504ec9b-2817-4153-b950-f80e095f196d',
              recipientId: createdUser.accountId,
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 45,
              date: '2024-08-10T19:22:51.000Z',
              isRecurring: false,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              senderId: createdUser.accountId,
              recipientId: '95a44029-2e8f-45d8-a15c-4f2f0e69e170',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 75,
              date: '2024-07-15T16:35:04.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: 'c66b87a6-4899-4219-bd33-84541e8c4c16',
              recipientId: createdUser.accountId,
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 100,
              date: '2024-07-30T13:20:14.000Z',
              isRecurring: true,
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              senderId: createdUser.accountId,
              recipientId: '879ce464-015e-4207-93b8-8aa81bcd2c95',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 50,
              date: '2024-08-02T13:31:11.000Z',
              isRecurring: false,
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              senderId: createdUser.accountId,
              recipientId: '77e339ee-56dc-466c-be2c-3a6acfd6660d',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 50,
              date: '2024-08-04T11:15:22.000Z',
              isRecurring: true,
              categoryId: 'd9afe042-0c60-41b7-a80f-7a4e7c5c5de8',
              senderId: createdUser.accountId,
              recipientId: '349916ed-9a92-42c0-9c0f-191d6a674163',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 65,
              date: '2024-08-17T21:08:09.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: createdUser.accountId,
              recipientId: '291307f5-486b-477a-8969-a2ee598cad02',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 65,
              date: '2024-07-08T15:20:41.000Z',
              isRecurring: false,
              categoryId: '6be79763-1678-485b-839f-590fa20c816f',
              senderId: createdUser.accountId,
              recipientId: 'f7f0f31f-deb9-40ca-8816-66d8268542ed',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 32.5,
              date: '2024-08-13T20:15:59.000Z',
              isRecurring: false,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              senderId: createdUser.accountId,
              recipientId: 'dfe995b4-3abd-43c5-9d75-a1dcc3f9229b',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 49.99,
              date: '2024-07-23T09:35:14.000Z',
              isRecurring: true,
              categoryId: '6be79763-1678-485b-839f-590fa20c816f',
              senderId: createdUser.accountId,
              recipientId: '4631ff82-94b6-41a6-9960-34649fc52cc2',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 5,
              date: '2024-08-11T15:45:38.000Z',
              isRecurring: false,
              categoryId: '68c027c7-c564-4251-ba2a-9a6acf54163d',
              senderId: createdUser.accountId,
              recipientId: '028ec2c3-516a-4119-851d-cf516225cdb7',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 20,
              date: '2024-07-06T17:10:09.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: createdUser.accountId,
              recipientId: '8d294ff9-e359-47e9-a43b-172c215f3f1f',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 22.5,
              date: '2024-08-06T10:05:44.000Z',
              isRecurring: false,
              categoryId: '36619eef-9c0b-4194-9cbc-431c959a98bb',
              senderId: createdUser.accountId,
              recipientId: 'a1321101-c4db-4c4e-ad17-d25b552c4876',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 0,
              date: '2024-07-02T19:50:05.000Z',
              isRecurring: false,
              categoryId: '36619eef-9c0b-4194-9cbc-431c959a98bb',
              senderId: createdUser.accountId,
              recipientId: 'e51eb002-ce58-43f8-8d89-8b4b15ebdd96',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 25,
              date: '2024-07-20T17:30:55.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: createdUser.accountId,
              recipientId: '55426691-c2e0-48b8-9f4b-95fa75dfe888',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 28.5,
              date: '2024-07-29T13:51:29.000Z',
              isRecurring: false,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              senderId: createdUser.accountId,
              recipientId: 'b149e59e-30a7-4f0b-8684-f053f5622506',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 50,
              date: '2024-08-14T13:05:27.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: 'c66b87a6-4899-4219-bd33-84541e8c4c16',
              recipientId: createdUser.accountId,
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 35,
              date: '2024-07-29T11:55:29.000Z',
              isRecurring: true,
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              senderId: createdUser.accountId,
              recipientId: '6bfd1ecb-ed4a-42c9-98b4-48b365ba7d40',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 42.75,
              date: '2024-07-27T20:15:06.000Z',
              isRecurring: false,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              senderId: createdUser.accountId,
              recipientId: 'ceab8019-77f7-4ecf-993e-db05f1dee76b',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 89.99,
              date: '2024-07-26T09:43:23.000Z',
              isRecurring: false,
              categoryId: 'cbc39ea0-6274-47b4-9c8b-e8240e4a88f2',
              senderId: createdUser.accountId,
              recipientId: '9a355d38-0a14-4607-8738-ac000eb9efa0',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 30,
              date: '2024-07-03T14:00:37.000Z',
              isRecurring: false,
              categoryId: '6bb2b046-de5a-4928-aa6d-81545793d5f3',
              senderId: createdUser.accountId,
              recipientId: 'e18a091d-bee3-469e-bb7f-fabdd437c6cf',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 78.5,
              date: '2024-08-06T08:25:44.000Z',
              isRecurring: false,
              categoryId: '87b34145-768b-48f8-a070-803c38b6a182',
              senderId: createdUser.accountId,
              recipientId: '1e31577b-61dc-4878-8fd4-a155ac037cd9',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 35.25,
              date: '2024-08-07T17:40:29.000Z',
              isRecurring: false,
              categoryId: '6be79763-1678-485b-839f-590fa20c816f',
              senderId: createdUser.accountId,
              recipientId: 'f7f0f31f-deb9-40ca-8816-66d8268542ed',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 52.75,
              date: '2024-07-16T10:10:51.000Z',
              isRecurring: false,
              categoryId: '87b34145-768b-48f8-a070-803c38b6a182',
              senderId: createdUser.accountId,
              recipientId: 'd832f8b0-fb00-42c4-bfd5-6716da568226',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 18.75,
              date: '2024-08-01T18:40:33.000Z',
              isRecurring: false,
              categoryId: '36619eef-9c0b-4194-9cbc-431c959a98bb',
              senderId: createdUser.accountId,
              recipientId: 'a50413e9-ed17-40ba-9a06-d07450df7e73',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 10,
              date: '2024-08-11T18:45:38.000Z',
              isRecurring: true,
              categoryId: '68c027c7-c564-4251-ba2a-9a6acf54163d',
              senderId: createdUser.accountId,
              recipientId: '1665d226-5bcc-40b4-99ce-44a17aeb0ffe',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 29.99,
              date: '2024-07-17T14:55:37.000Z',
              isRecurring: false,
              categoryId: 'cbc39ea0-6274-47b4-9c8b-e8240e4a88f2',
              senderId: createdUser.accountId,
              recipientId: '9a355d38-0a14-4607-8738-ac000eb9efa0',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 10,
              date: '2024-07-13T09:15:32.000Z',
              isRecurring: false,
              categoryId: '68c027c7-c564-4251-ba2a-9a6acf54163d',
              senderId: createdUser.accountId,
              recipientId: '77e339ee-56dc-466c-be2c-3a6acfd6660d',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 15,
              date: '2024-08-08T08:55:17.000Z',
              isRecurring: false,
              categoryId: '36619eef-9c0b-4194-9cbc-431c959a98bb',
              senderId: createdUser.accountId,
              recipientId: 'a50413e9-ed17-40ba-9a06-d07450df7e73',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 42.3,
              date: '2024-08-18T09:45:32.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: createdUser.accountId,
              recipientId: 'a8fb0c67-1ff0-4e5d-82ed-b7a1d0cb7a69',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 55.5,
              date: '2024-08-19T20:23:11.000Z',
              isRecurring: false,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              senderId: createdUser.accountId,
              recipientId: 'c1e74398-3d41-4c62-9388-825c10485157',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 75.5,
              date: '2024-08-19T14:23:11.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: '55426691-c2e0-48b8-9f4b-95fa75dfe888',
              recipientId: createdUser.accountId,
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 27.5,
              date: '2024-07-10T12:30:13.000Z',
              isRecurring: false,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              senderId: createdUser.accountId,
              recipientId: 'b149e59e-30a7-4f0b-8684-f053f5622506',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 65.75,
              date: '2024-08-15T18:20:33.000Z',
              isRecurring: false,
              categoryId: '87b34145-768b-48f8-a070-803c38b6a182',
              senderId: 'c66b87a6-4899-4219-bd33-84541e8c4c16',
              recipientId: createdUser.accountId,
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 29.99,
              date: '2024-07-25T16:25:37.000Z',
              isRecurring: false,
              categoryId: 'cbc39ea0-6274-47b4-9c8b-e8240e4a88f2',
              senderId: createdUser.accountId,
              recipientId: '08cd0fca-f2c4-48f3-99ce-07eb9e138776',
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 0,
              date: '2024-07-19T12:45:09.000Z',
              isRecurring: false,
              categoryId: '16d4e8a4-3081-437b-b66d-b770bafdc7b0',
              senderId: 'a8fb0c67-1ff0-4e5d-82ed-b7a1d0cb7a69',
              recipientId: createdUser.accountId,
              userId: createdUser.id,
            },
            {
              description: '',
              amount: 41.25,
              date: '2024-07-14T20:50:18.000Z',
              isRecurring: false,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              senderId: createdUser.accountId,
              recipientId: 'dfe995b4-3abd-43c5-9d75-a1dcc3f9229b',
              userId: createdUser.id,
            },
          ]

          const budgets = [
            {
              amount: 75,
              categoryId: 'a1f42f9d-1b03-45f8-9a18-8488c27bdabf',
              userId: createdUser.id,
              themeId: '75bc8ac0-35f9-4549-97e9-8acd53c56f09',
            },
            {
              amount: 50,
              categoryId: '68c027c7-c564-4251-ba2a-9a6acf54163d',
              userId: createdUser.id,
              themeId: '49fcf105-e8a9-49b0-af57-43bb7ccabae1',
            },
            {
              amount: 100,
              categoryId: '6bb2b046-de5a-4928-aa6d-81545793d5f3',
              userId: createdUser.id,
              themeId: '0f23f996-6d7f-48ae-b034-43640799ca96',
            },
            {
              amount: 750,
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              userId: createdUser.id,
              themeId: 'd33c33a5-2b16-475d-840e-76961b9765a4',
            },
          ]

          const pots = [
            {
              name: 'Savings',
              targetAmount: 2000,
              currentAmount: 159,
              userId: createdUser.id,
              themeId: '49fcf105-e8a9-49b0-af57-43bb7ccabae1',
            },
            {
              name: 'New Laptop',
              targetAmount: 1000,
              currentAmount: 10,
              userId: createdUser.id,
              themeId: '75bc8ac0-35f9-4549-97e9-8acd53c56f09',
            },
            {
              name: 'Concert Ticket',
              targetAmount: 150,
              currentAmount: 130,
              userId: createdUser.id,
              themeId: '0f23f996-6d7f-48ae-b034-43640799ca96',
            },
            {
              name: 'Gift',
              targetAmount: 60,
              currentAmount: 40,
              userId: createdUser.id,
              themeId: 'd33c33a5-2b16-475d-840e-76961b9765a4',
            },
          ]

          const recurringBills = [
            {
              description: '',
              amount: 100,
              recurrenceDay: 2,
              recurrenceFrequency: 'montlhy',
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              userId: createdUser.id,
              recipientId: '553f5bf4-4273-4dd8-b41f-d3ae75297c8c',
              senderId: createdUser.accountId,
            },
            {
              description: '',
              amount: 30,
              recurrenceDay: 3,
              recurrenceFrequency: 'montlhy',
              categoryId: '6bb2b046-de5a-4928-aa6d-81545793d5f3',
              userId: createdUser.id,
              recipientId: 'e18a091d-bee3-469e-bb7f-fabdd437c6cf',
              senderId: createdUser.accountId,
            },
            {
              description: '',
              amount: 100,
              recurrenceDay: 30,
              recurrenceFrequency: 'montlhy',
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              userId: createdUser.id,
              recipientId: '879ce464-015e-4207-93b8-8aa81bcd2c95',
              senderId: createdUser.accountId,
            },
            {
              description: '',
              amount: 10,
              recurrenceDay: 11,
              recurrenceFrequency: 'montlhy',
              categoryId: '68c027c7-c564-4251-ba2a-9a6acf54163d',
              userId: createdUser.id,
              recipientId: '1665d226-5bcc-40b4-99ce-44a17aeb0ffe',
              senderId: createdUser.accountId,
            },
            {
              description: '',
              amount: 49.99,
              recurrenceDay: 23,
              recurrenceFrequency: 'montlhy',
              categoryId: '6be79763-1678-485b-839f-590fa20c816f',
              userId: createdUser.id,
              recipientId: '4631ff82-94b6-41a6-9960-34649fc52cc2',
              senderId: createdUser.accountId,
            },
            {
              description: '',
              amount: 35,
              recurrenceDay: 29,
              recurrenceFrequency: 'montlhy',
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              userId: createdUser.id,
              recipientId: '6bfd1ecb-ed4a-42c9-98b4-48b365ba7d40',
              senderId: createdUser.accountId,
            },
            {
              description: '',
              amount: 50,
              recurrenceDay: 4,
              recurrenceFrequency: 'montlhy',
              categoryId: 'd9afe042-0c60-41b7-a80f-7a4e7c5c5de8',
              userId: createdUser.id,
              recipientId: '349916ed-9a92-42c0-9c0f-191d6a674163',
              senderId: createdUser.accountId,
            },
            {
              description: '',
              amount: 9.99,
              recurrenceDay: 21,
              recurrenceFrequency: 'montlhy',
              categoryId: '5bec06ac-7b76-4644-a86f-7082489a632a',
              userId: createdUser.id,
              recipientId: '60663bb3-24ca-4da5-a64c-c369078180f1',
              senderId: createdUser.accountId,
            },
          ]

          await prisma.transaction.createMany({
            data: transactions,
          })

          await prisma.budget.createMany({
            data: budgets,
          })

          await prisma.pot.createMany({
            data: pots,
          })

          await prisma.recurringBill.createMany({
            data: recurringBills,
          })

          return createdUser
        })

        return res.status(201).json({
          user: newUser,
          message: 'User successfully created!',
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ message: error.errors[0].message })
        } else if (error instanceof Error) {
          return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: 'Internal server error' })
      }
    })
  } else {
    res.status(405).end()
  }
}
