import React from 'react'
import { auth, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
export default async function DashboardPage() {
  const session = await auth()
  if (!session) {
    return <div>Not authenticated</div>
  }
  return (
    <div className="container">
      <form action={async () => {
        "use server"
        await signOut({
          redirect: true,
          redirectTo: '/login'
        })
      }}>
        <pre>{JSON.stringify(session, null, 4)}</pre>
        <Button>Sign out</Button>
      </form>
    </div>
  )
}
