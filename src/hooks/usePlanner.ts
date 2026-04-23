'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toISODate } from '@/lib/dates'
import type { PlannedSession, Event, TimeSlot } from '@/types'

export function usePlanner(monday: Date) {
  const [sessions, setSessions] = useState<PlannedSession[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [restDays, setRestDays] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const weekStart = toISODate(monday)
  const weekEndDate = new Date(monday)
  weekEndDate.setDate(weekEndDate.getDate() + 6)
  const weekEnd = toISODate(weekEndDate)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    const [sessRes, evtRes, restRes] = await Promise.all([
      supabase
        .from('planned_sessions')
        .select('*')
        .gte('date', weekStart)
        .lte('date', weekEnd)
        .order('display_order'),
      supabase
        .from('events')
        .select('*')
        .lte('start_date', weekEnd)
        .or(`end_date.gte.${weekStart},end_date.is.null`),
      supabase
        .from('rest_days')
        .select('date')
        .gte('date', weekStart)
        .lte('date', weekEnd),
    ])

    setSessions((sessRes.data ?? []) as PlannedSession[])
    setEvents((evtRes.data ?? []) as Event[])
    setRestDays(new Set((restRes.data ?? []).map(r => r.date as string)))
    setLoading(false)
  }, [weekStart, weekEnd])

  useEffect(() => { load() }, [load])

  async function toggleRestDay(date: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (restDays.has(date)) {
      await supabase.from('rest_days').delete().eq('user_id', user.id).eq('date', date)
      setRestDays(prev => { const next = new Set(prev); next.delete(date); return next })
    } else {
      await supabase.from('rest_days').insert({ user_id: user.id, date })
      setRestDays(prev => new Set([...prev, date]))
    }
  }

  async function addSession(
    activityId: string | null,
    activityName: string,
    categoryName: string,
    categoryColor: string,
    date: string,
    timeSlot: TimeSlot
  ) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const existing = sessions.filter(s => s.date === date && s.time_slot === timeSlot)
    const displayOrder = existing.length

    const { data, error } = await supabase
      .from('planned_sessions')
      .insert({
        user_id: user.id,
        activity_id: activityId,
        activity_name: activityName,
        category_name: categoryName,
        category_color: categoryColor,
        date,
        time_slot: timeSlot,
        status: 'planned',
        display_order: displayOrder,
      })
      .select()
      .single()

    if (!error && data) {
      setSessions(prev => [...prev, data as PlannedSession])
    }
  }

  async function markDone(id: string) {
    const supabase = createClient()
    await supabase.from('planned_sessions').update({ status: 'completed' }).eq('id', id)
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'completed' } : s))
  }

  async function undoDone(id: string) {
    const supabase = createClient()
    await supabase.from('planned_sessions').update({ status: 'planned' }).eq('id', id)
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'planned' } : s))
  }

  async function removeSession(id: string) {
    const supabase = createClient()
    await supabase.from('planned_sessions').delete().eq('id', id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  // Rest days don't count towards completion stats
  const completedCount = sessions.filter(s => s.status === 'completed').length
  const totalCount = sessions.length

  return {
    sessions,
    events,
    restDays,
    loading,
    reload: load,
    addSession,
    markDone,
    undoDone,
    removeSession,
    toggleRestDay,
    completedCount,
    totalCount,
  }
}
