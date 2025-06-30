import React from 'react'
import { auth } from '@/lib/auth'

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    return <div>Not authenticated</div>
  }

  if (session.user?.role !== 'admin') {
    return <div>Not authorized</div>
  }

  return (
    <div>AdminPage
    
    </div>
  )
}
