'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/types'

export function useEvents() {
  const [saving, setSaving] = useState(false)

  const addEvent = useCallback(async (
    name: string,
    startDate: string,
    endDate: string | null,
    notes: string | null
  ) => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return null }

    const { data, error } = await supabase
      .from('events')
      .insert({ user_id: user.id, name, start_date: startDate, end_date: endDate || null, notes: notes || null })
      .select()
      .single()

    setSaving(false)
    if (error) return null
    return data as Event
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    const supabase = createClient()
    await supabase.from('events').delete().eq('id', id)
  }, [])

  return { addEvent, deleteEvent, saving }
}
