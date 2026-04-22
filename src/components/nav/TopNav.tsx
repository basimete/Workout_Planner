'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarDays, Dumbbell, BarChart2, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/planner',  label: 'Planner',  Icon: CalendarDays },
  { href: '/library',  label: 'Library',  Icon: Dumbbell },
  { href: '/summary',  label: 'Summary',  Icon: BarChart2 },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

interface TopNavProps {
  email?: string
}

export function TopNav({ email }: TopNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header
      className="hidden md:flex items-center justify-between px-6 py-4 sticky top-0 z-40"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#84cc16' }}>
          <Dumbbell size={14} color="white" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Workout Planner
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                color: active ? '#84cc16' : 'var(--color-muted)',
                backgroundColor: active ? '#84cc1615' : 'transparent',
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 1.75} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="flex items-center gap-3">
        {email && (
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{email}</span>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-muted)' }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </header>
  )
}
