'use client'

import { useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import { useWeekNav } from '@/hooks/useWeekNav'
import { usePlanner } from '@/hooks/usePlanner'
import { useEvents } from '@/hooks/useEvents'
import { useSettings } from '@/hooks/useSettings'
import { getWeekDays, toISODate } from '@/lib/dates'
import { WeekNav } from './WeekNav'
import { CompletionBar } from './CompletionBar'
import { WeekGrid } from './WeekGrid'
import { WeekMobile } from './WeekMobile'
import { ActivityPicker } from './ActivityPicker'
import { AddEventModal } from './AddEventModal'
import { Button } from '@/components/ui/Button'
import type { Activity, TimeSlot } from '@/types'

export function WeeklyPlanner() {
  const { monday, prevWeek, nextWeek, goToToday } = useWeekNav()
  const { sessions, events, restDays, loading, addSession, markDone, undoDone, removeSession, toggleRestDay, completedCount, totalCount, reload } = usePlanner(monday)
  const { addEvent } = useEvents()
  const { visibleSlots } = useSettings()

  const [pickerOpen, setPickerOpen] = useState(false)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [pendingCell, setPendingCell] = useState<{ date: string; slot: TimeSlot } | null>(null)

  const weekDays = getWeekDays(monday)

  function handleAddToSlot(date: string, slot: TimeSlot) {
    setPendingCell({ date, slot })
    setPickerOpen(true)
  }

  async function handleActivitySelect(activity: Activity) {
    if (!pendingCell) return
    const cat = { name: activity.category?.name ?? '', color: activity.category?.color ?? '#84cc16' }
    // Category-only selection has id === category_id; pass null so the FK constraint isn't violated
    const activityId = activity.id === activity.category_id ? null : activity.id
    await addSession(
      activityId,
      activity.name,
      cat.name,
      cat.color,
      pendingCell.date,
      pendingCell.slot
    )
    setPendingCell(null)
  }

  async function handleAddEvent(name: string, startDate: string, endDate: string | null, notes: string | null) {
    await addEvent(name, startDate, endDate, notes)
    await reload()
  }

  const gridProps = {
    weekDays,
    sessions,
    events,
    visibleSlots,
    restDays,
    onAdd: handleAddToSlot,
    onMarkDone: markDone,
    onUndo: undoDone,
    onRemove: removeSession,
    onToggleRest: toggleRestDay,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Workout Planner</h1>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setEventModalOpen(true)}
        >
          <CalendarPlus size={14} />
          Event
        </Button>
      </div>

      {/* Week nav */}
      <div className="mb-4">
        <WeekNav monday={monday} onPrev={prevWeek} onNext={nextWeek} onToday={goToToday} />
      </div>

      {/* Completion bar */}
      <div className="mb-5">
        <CompletionBar completed={completedCount} total={totalCount} />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#84cc16', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <>
          {/* Desktop grid (md+) */}
          <div className="hidden md:block">
            <WeekGrid {...gridProps} />
          </div>

          {/* Mobile list (< md) */}
          <div className="md:hidden">
            <WeekMobile {...gridProps} />
          </div>
        </>
      )}

      {/* Activity picker */}
      <ActivityPicker
        open={pickerOpen}
        onClose={() => { setPickerOpen(false); setPendingCell(null) }}
        onSelect={handleActivitySelect}
      />

      {/* Add event modal */}
      <AddEventModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onAdd={handleAddEvent}
      />
    </div>
  )
}
