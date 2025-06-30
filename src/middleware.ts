import NextAuth from 'next-auth'
import authConfig from '/auth.config'
import { NextResponse } from 'next/server'

// esta linea se debe quitar para que funcione como se espera
const { auth: middleware } = NextAuth(authConfig)

const protectedRoutes = ['/dashboard', '/admin']

export default middleware((req) => {
  const { nextUrl, auth } = req
  const isLoggedIn = !!auth?.user

  if (protectedRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  return NextResponse.next()
})
