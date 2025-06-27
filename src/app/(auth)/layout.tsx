import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="flex items-center justify-center h-screen">{children}</div>
    </main>
  )
}
