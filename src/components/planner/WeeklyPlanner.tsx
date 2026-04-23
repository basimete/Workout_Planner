'use client'

import { useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import { useWeekNav } from '@/hooks/useWeekNav'
import { usePlanner } from '@/hooks/usePlanner'
import { useEvents } from '@/hooks/useEvents'
import { useSettings } from '@/hooks/useSettings'
import { getWeekDays } from '@/lib/dates'
import { WeekNav } from './WeekNav'
import { CompletionBar } from './CompletionBar'
import { WeekGrid } from './WeekGrid'
import { WeekMobile } from './WeekMobile'
import { ActivityPicker } from './ActivityPicker'
import { TimeSlotPicker } from './TimeSlotPicker'
import { AddEventModal } from './AddEventModal'
import { Button } from '@/components/ui/Button'
import type { Activity, TimeSlot } from '@/types'

export function WeeklyPlanner() {
  const { monday, prevWeek, nextWeek, goToToday } = useWeekNav()
  const { sessions, events, restDays, loading, addSession, markDone, undoDone, removeSession, toggleRestDay, completedCount, totalCount, reload } = usePlanner(monday)
  const { addEvent } = useEvents()
  const { visibleSlots } = useSettings()

  const [activityPickerOpen, setActivityPickerOpen] = useState(false)
  const [slotPickerOpen, setSlotPickerOpen] = useState(false)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [pendingDate, setPendingDate] = useState<string | null>(null)
  const [pendingActivity, setPendingActivity] = useState<Activity | null>(null)

  const weekDays = getWeekDays(monday)

  // Step 1: user taps + Add on a day
  function handleAddToDay(date: string) {
    setPendingDate(date)
    setActivityPickerOpen(true)
  }

  // Step 2a: user picks an activity → open slot picker
  function handleActivitySelect(activity: Activity) {
    setPendingActivity(activity)
    setActivityPickerOpen(false)
    setSlotPickerOpen(true)
  }

  // Step 2b: user picks a time slot → save the session
  async function handleSlotSelect(slot: TimeSlot) {
    if (!pendingDate || !pendingActivity) return
    const activity = pendingActivity
    const cat = {
      name: activity.category?.name ?? '',
      color: activity.category?.color ?? '#84cc16',
    }
    const activityId = activity.id === activity.category_id ? null : activity.id
    await addSession(activityId, activity.name, cat.name, cat.color, pendingDate, slot)
    setPendingDate(null)
    setPendingActivity(null)
    setSlotPickerOpen(false)
  }

  function handleCancelActivityPicker() {
    setActivityPickerOpen(false)
    // Don't reset pendingDate here — ActivityPicker calls onClose() after onSelect(),
    // which would null out pendingDate before the slot picker can use it.
    // Reset happens in handleSlotSelect / handleCancelSlotPicker instead.
  }

  function handleCancelSlotPicker() {
    setSlotPickerOpen(false)
    setPendingActivity(null)
    setPendingDate(null)
  }

  async function handleAddEvent(name: string, startDate: string, endDate: string | null, notes: string | null) {
    await addEvent(name, startDate, endDate, notes)
    await reload()
  }

  const gridProps = {
    weekDays,
    sessions,
    events,
    restDays,
    onAdd: handleAddToDay,
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
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#84cc16', borderTopColor: 'transparent' }}
          />
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

      {/* Step 1: Activity picker */}
      <ActivityPicker
        open={activityPickerOpen}
        onClose={handleCancelActivityPicker}
        onSelect={handleActivitySelect}
      />

      {/* Step 2: Time slot picker */}
      <TimeSlotPicker
        open={slotPickerOpen}
        onClose={handleCancelSlotPicker}
        onSelect={handleSlotSelect}
        visibleSlots={visibleSlots}
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
