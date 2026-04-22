'use client'

import { Plus } from 'lucide-react'
import { ActivityChip } from './ActivityChip'
import { EventBanner } from './EventBanner'
import type { PlannedSession, Event, TimeSlot } from '@/types'

interface SlotCellProps {
  date: string
  timeSlot: TimeSlot
  sessions: PlannedSession[]
  events: Event[]
  onAdd: (date: string, slot: TimeSlot) => void
  onMarkDone: (id: string) => void
  onUndo: (id: string) => void
  onRemove: (id: string) => void
  showEvents?: boolean
  /** Hide the inline add button — used in mobile where the slot header row has its own + button */
  hideAddButton?: boolean
}

export function SlotCell({
  date, timeSlot, sessions, events, onAdd, onMarkDone, onUndo, onRemove,
  showEvents = false, hideAddButton = false,
}: SlotCellProps) {
  const slotSessions = sessions.filter(s => s.date === date && s.time_slot === timeSlot)
  const dayEvents = showEvents ? events.filter(e =>
    date >= e.start_date && date <= (e.end_date ?? e.start_date)
  ) : []

  const isEmpty = slotSessions.length === 0 && dayEvents.length === 0

  return (
    <div
      className="relative rounded-xl p-2 min-h-[52px] w-full flex flex-col gap-1.5 group/cell overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface-2)' }}
      // Clicking the background of an empty cell adds an activity (desktop UX)
      onClick={isEmpty && !hideAddButton ? () => onAdd(date, timeSlot) : undefined}
    >
      {dayEvents.map(evt => (
        <EventBanner key={evt.id} event={evt} />
      ))}

      {slotSessions.map(s => (
        <ActivityChip
          key={s.id}
          session={s}
          onMarkDone={onMarkDone}
          onUndo={onUndo}
          onRemove={onRemove}
        />
      ))}

      {/* Desktop: hover add button — absolutely positioned so it doesn't push cell height */}
      {!hideAddButton && !isEmpty && (
        <button
          onClick={e => { e.stopPropagation(); onAdd(date, timeSlot) }}
          className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 rounded-md px-1.5 py-0.5 opacity-0 group-hover/cell:opacity-100 transition-opacity"
          style={{ color: 'var(--color-muted)' }}
        >
          <Plus size={11} />
          <span className="text-[10px]">Add</span>
        </button>
      )}

      {/* Desktop empty cell: show a centered + hint on hover */}
      {!hideAddButton && isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 group-hover/cell:opacity-100 transition-opacity cursor-pointer">
          <Plus size={14} style={{ color: 'var(--color-muted)' }} />
        </div>
      )}
    </div>
  )
}
