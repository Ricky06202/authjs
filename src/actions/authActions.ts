'use server'
import { signIn } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { loginSchema, registerSchema } from '@/lib/zod'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'
import { z } from 'zod'
export async function loginAction(
  values: z.infer<typeof loginSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: error.cause?.err?.message || 'Internal server error',
      }
    }
    return { success: false, error: 'Internal server error' }
  }
}

export async function registerAction(
  values: z.infer<typeof registerSchema>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, success } = registerSchema.safeParse(values)

    if (!success) {
      return { success: false, error: 'Invalid data' }
    }
    // verificamos si ya existe el usuario
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (user) {
      return { success: false, error: 'User already exists' }
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    await prisma.user.create({
      data: {
        name: data.username,
        email: data.email,
        password: passwordHash,
      },
    })

    const response = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error: error.cause?.err?.message || 'Internal server error',
      }
    }
    return { success: false, error: 'Internal server error' }
  }
}
