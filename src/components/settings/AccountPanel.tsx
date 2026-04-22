'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

interface AccountPanelProps {
  email: string
}

export function AccountPanel({ email }: AccountPanelProps) {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ backgroundColor: 'var(--color-surface-2)' }}
      >
        <Mail size={16} style={{ color: 'var(--color-muted)' }} />
        <span className="text-sm" style={{ color: 'var(--color-text)' }}>{email}</span>
      </div>

      <Button variant="ghost" onClick={signOut} className="justify-start gap-2 px-4">
        <LogOut size={15} />
        Sign out
      </Button>
    </div>
  )
}
