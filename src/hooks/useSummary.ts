'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PlannedSession, Event } from '@/types'

export interface CategoryStat {
  name: string
  color: string
  count: number
}

export function useSummary(year: number, month: number) {
  const [sessions, setSessions] = useState<PlannedSession[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  useEffect(() => {
    async function load() {
      setLoading(true)
      const supabase = createClient()

      const [sessRes, evtRes] = await Promise.all([
        supabase
          .from('planned_sessions')
          .select('*')
          .gte('date', startDate)
          .lte('date', endDate),
        // Fetch events whose start_date falls within the month; multi-day events
        // that start before the month are handled by the eventsByDay calc below.
        supabase
          .from('events')
          .select('*')
          .lte('start_date', endDate)
          .or(`end_date.gte.${startDate},end_date.is.null`),
      ])

      setSessions((sessRes.data ?? []) as PlannedSession[])
      setEvents((evtRes.data ?? []) as Event[])
      setLoading(false)
    }
    load()
  }, [year, month, startDate, endDate])

  const completed = sessions.filter(s => s.status === 'completed')
  const totalCompleted = completed.length
  const activeDays = new Set(completed.map(s => s.date)).size

  const categoryMap = new Map<string, CategoryStat>()
  for (const s of completed) {
    if (!categoryMap.has(s.category_name)) {
      categoryMap.set(s.category_name, { name: s.category_name, color: s.category_color, count: 0 })
    }
    categoryMap.get(s.category_name)!.count++
  }
  const categoryStats: CategoryStat[] = [...categoryMap.values()].sort((a, b) => b.count - a.count)

  // Per-day completion map: date -> count
  const completedByDay: Record<string, number> = {}
  for (const s of completed) {
    completedByDay[s.date] = (completedByDay[s.date] ?? 0) + 1
  }

  // Events by date
  const eventsByDay: Record<string, Event[]> = {}
  for (const evt of events) {
    const start = evt.start_date
    const end = evt.end_date ?? evt.start_date
    let cur = new Date(start)
    const endD = new Date(end)
    while (cur <= endD) {
      const iso = cur.toISOString().split('T')[0]
      if (iso >= startDate && iso <= endDate) {
        if (!eventsByDay[iso]) eventsByDay[iso] = []
        eventsByDay[iso].push(evt)
      }
      cur.setDate(cur.getDate() + 1)
    }
  }

  return {
    loading,
    totalCompleted,
    activeDays,
    categoryStats,
    completedByDay,
    eventsByDay,
  }
}
