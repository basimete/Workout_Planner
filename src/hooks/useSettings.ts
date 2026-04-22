'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserSettings, TimeSlot, Theme } from '@/types'

const DEFAULT_SETTINGS: Omit<UserSettings, 'user_id' | 'updated_at'> = {
  visible_time_slots: ['Lunchtime', 'Evening'],
  theme: 'system',
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        setSettings(data as UserSettings)
      } else {
        // First visit — create default settings row
        const defaults = { user_id: user.id, ...DEFAULT_SETTINGS }
        const { data: created } = await supabase
          .from('user_settings')
          .insert(defaults)
          .select()
          .single()
        if (created) setSettings(created as UserSettings)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function updateTimeSlots(slots: TimeSlot[]) {
    if (!settings) return
    const supabase = createClient()
    await supabase
      .from('user_settings')
      .update({ visible_time_slots: slots, updated_at: new Date().toISOString() })
      .eq('user_id', settings.user_id)
    setSettings(prev => prev ? { ...prev, visible_time_slots: slots } : prev)
  }

  async function updateTheme(theme: Theme) {
    if (!settings) return
    const supabase = createClient()
    await supabase
      .from('user_settings')
      .update({ theme, updated_at: new Date().toISOString() })
      .eq('user_id', settings.user_id)
    setSettings(prev => prev ? { ...prev, theme } : prev)

    // Apply immediately
    localStorage.setItem('theme', theme)
    const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }

  const visibleSlots: TimeSlot[] = settings?.visible_time_slots ?? DEFAULT_SETTINGS.visible_time_slots

  return { settings, loading, visibleSlots, updateTimeSlots, updateTheme }
}
