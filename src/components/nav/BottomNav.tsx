'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Dumbbell, BarChart2, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/planner',  label: 'Planner',  Icon: CalendarDays },
  { href: '/library',  label: 'Library',  Icon: Dumbbell },
  { href: '/summary',  label: 'Summary',  Icon: BarChart2 },
  { href: '/settings', label: 'Settings', Icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-2.5 transition-opacity"
              style={{ color: active ? '#84cc16' : 'var(--color-muted)' }}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
