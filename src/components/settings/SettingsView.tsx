'use client'

import { useSettings } from '@/hooks/useSettings'
import { TimeSlotToggles } from './TimeSlotToggles'
import { AccountPanel } from './AccountPanel'
import { ThemeToggle } from './ThemeToggle'
import type { Theme, TimeSlot } from '@/types'

interface SettingsViewProps {
  email: string
}

export function SettingsView({ email }: SettingsViewProps) {
  const { settings, loading, visibleSlots, updateTimeSlots, updateTheme } = useSettings()

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Settings</h1>

      {/* Appearance */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-muted)' }}>
          Appearance
        </h2>
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>Theme</p>
          <ThemeToggle
            value={settings?.theme ?? 'system'}
            onChange={(t: Theme) => updateTheme(t)}
          />
        </div>
      </section>

      {/* Time slots */}
      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-muted)' }}>
          Time slots
        </h2>
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text)' }}>
            Visible in the planner
          </p>
          {loading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#84cc16', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <TimeSlotToggles
              visible={visibleSlots}
              onChange={(slots: TimeSlot[]) => updateTimeSlots(slots)}
            />
          )}
        </div>
      </section>

      {/* Account */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-muted)' }}>
          Account
        </h2>
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <AccountPanel email={email} />
        </div>
      </section>
    </div>
  )
}
