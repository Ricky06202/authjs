import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/zod"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"
import { sendVerificationEmail } from "@/lib/mail"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Credentials({
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      // 1 Obtener los datos de las credenciales
      const { data, success } = loginSchema.safeParse(credentials)

      // 2 Validar los datos
      if (!success) {
        throw new Error("Invalid credentials")
      }

      // 3 Verificar si existe en la base de datos
      const user = await prisma.user.findUnique({
        where: {
          email: data.email,
        }
      })

      // 4 Verificar si el usuario existe
      if (!user || !user.password) {
        throw new Error("Invalid credentials")
      }

      // 5 Verificar si la contraseña es correcta
      const isPasswordValid = await bcrypt.compare(data.password, user.password)
      
      if (!isPasswordValid) {
        throw new Error("Invalid credentials")
      }

      // 6 Verificacion del Email
      if (!user.emailVerified) {
        const verifyTokenExists = await prisma.verificationToken.findFirst({
          where: {
            identifier: user.email,
          }
        })

        // si existe el token lo eliminamos
        if (verifyTokenExists) {
          await prisma.verificationToken.delete({
            where: {
              identifier: user.email,
            }
          })
        }

        const token = nanoid()

        await prisma.verificationToken.create({
          data: {
            identifier: user.email,
            token,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          }
        })

        // enviar correo electronico

        await sendVerificationEmail(user.email, token)

        throw new Error("Please verify your email address")
        
      }

      return user


    },
  }),],
} satisfies NextAuthConfig