import { IncomingForm } from 'formidable'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { buildNextAuthOptions } from '../auth/[...nextauth].api'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface Updates {
  name?: string | undefined
  email?: string | undefined
  password?: string | undefined
  oldPassword?: string | undefined
  avatarUrl?: string | undefined
  initialBalance?: number | undefined
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
  if (req.method === 'GET') {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(400).json({ message: 'Unauthorized' })
    }

    const userId = session?.user?.id?.toString()

    const profile = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return res.json({ profile })
  } else if (req.method === 'PUT') {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      return res.status(400).json({ message: 'Unauthorized' })
    }

    const form = new IncomingForm()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error processing form' })
      }

      try {
        const userId = session?.user?.id?.toString()

        const updatedFields: {
          name?: string
          email?: string
          password?: string
          initialBalance?: string
          oldPassword?: string
        } = {
          name: fields.name ? getSingleString(fields.name) : undefined,
          email: fields.email ? getSingleString(fields.email) : undefined,
          initialBalance: fields.initialBalance
            ? getSingleString(fields.initialBalance)
            : undefined,
          password: fields.password
            ? getSingleString(fields.password)
            : undefined,
          oldPassword: fields.oldPassword
            ? getSingleString(fields.oldPassword)
            : undefined,
        }

        const updateUserSchema = z.object({
          name: z.string().optional(),
          initialBalance: z
            .string()
            .transform((value) => (value ? parseFloat(value) : undefined))
            .optional(),
          email: z.string().email('Invalid email').optional(),
          password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
              /[a-z]/,
              'Password must contain at least one lowercase letter',
            )
            .regex(/[0-9]/, 'Password must contain at least one number')
            .optional(),
          oldPassword: z.string().min(8, 'Old password is required').optional(),
        })

        const validatedFields = await updateUserSchema.parseAsync(updatedFields)

        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (validatedFields.oldPassword && user) {
          const passwordMatch = await bcrypt.compare(
            validatedFields.oldPassword,
            user.password as string,
          )

          if (!passwordMatch) {
            return res
              .status(400)
              .json({ message: 'Incorrect current password' })
          }
        }

        let avatarUrl

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

        const updates: Updates = { ...validatedFields }

        if (avatarUrl) {
          updates.avatarUrl = avatarUrl
        }

        if (validatedFields.password) {
          updates.password = await bcrypt.hash(validatedFields.password, 10)
        }

        delete updates.oldPassword

        const updatedUser = await prisma.user.update({
          where: { id: userId.toString() },
          data: updates,
        })

        return res
          .status(200)
          .json({ updatedUser, message: 'User successfully updated!' })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ message: error.errors[0].message })
        } else if (error instanceof Error) {
          return res.status(400).json({ message: error.message })
        }
        return res.status(500).json({ message: 'Internal server error' })
      }
    })
  } else if (req.method === 'POST') {
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

        const newUser = await prisma.user.create({
          data: {
            name: validatedFields.name,
            email: validatedFields.email,
            password: hashedPassword,
            initialBalance: validatedFields.initialBalance ?? 0,
            avatarUrl: avatarUrl ?? null,
          },
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
