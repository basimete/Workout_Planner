'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import type { Theme } from '@/types'

const OPTIONS: { value: Theme; label: string; Icon: React.ElementType }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'dark', label: 'Dark', Icon: Moon },
]

interface ThemeToggleProps {
  value: Theme
  onChange: (theme: Theme) => void
}

export function ThemeToggle({ value, onChange }: ThemeToggleProps) {
  return (
    <div
      className="flex rounded-xl p-1"
      style={{ backgroundColor: 'var(--color-surface-2)' }}
    >
      {OPTIONS.map(({ value: v, label, Icon }) => {
        const active = value === v
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: active ? 'var(--color-surface)' : 'transparent',
              color: active ? 'var(--color-text)' : 'var(--color-muted)',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
