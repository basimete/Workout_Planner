'use client'

import { SlotCell } from './SlotCell'
import { formatDayShort, formatDayNum, isToday, toISODate } from '@/lib/dates'
import { TIME_SLOT_LABELS } from '@/types'
import type { PlannedSession, Event, TimeSlot } from '@/types'

interface WeekGridProps {
  weekDays: Date[]
  sessions: PlannedSession[]
  events: Event[]
  visibleSlots: TimeSlot[]
  restDays: Set<string>
  onAdd: (date: string, slot: TimeSlot) => void
  onMarkDone: (id: string) => void
  onUndo: (id: string) => void
  onRemove: (id: string) => void
  onToggleRest: (date: string) => void
}

export function WeekGrid({
  weekDays, sessions, events, visibleSlots, restDays,
  onAdd, onMarkDone, onUndo, onRemove, onToggleRest,
}: WeekGridProps) {
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: '640px' }}>
        {/* Day headers */}
        <div
          className="grid sticky top-0 z-10"
          style={{
            gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)`,
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <div />
          {weekDays.map(day => {
            const today = isToday(day)
            const dateStr = toISODate(day)
            const isRest = restDays.has(dateStr)
            return (
              <div key={dateStr} className="text-center py-2 px-1">
                <p
                  className="text-xs font-medium"
                  style={{ color: today ? '#84cc16' : 'var(--color-muted)' }}
                >
                  {formatDayShort(day)}
                </p>
                <div
                  className="text-sm font-bold mt-0.5 mx-auto w-7 h-7 flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: today ? '#84cc16' : 'transparent',
                    color: today ? 'white' : 'var(--color-text)',
                  }}
                >
                  {formatDayNum(day)}
                </div>
                {/* Rest toggle */}
                <button
                  onClick={() => onToggleRest(dateStr)}
                  className="mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md transition-all"
                  style={{
                    backgroundColor: isRest ? 'var(--color-surface-2)' : 'transparent',
                    color: isRest ? 'var(--color-muted)' : 'var(--color-border)',
                  }}
                >
                  {isRest ? 'Rest' : '· · ·'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Slot rows */}
        {visibleSlots.map((slot, slotIdx) => (
          <div
            key={slot}
            className="grid items-start gap-1 mb-1.5"
            style={{ gridTemplateColumns: `80px repeat(${weekDays.length}, 1fr)` }}
          >
            {/* Slot label */}
            <div className="self-stretch flex items-center justify-end pr-3">
              <span className="text-[11px] font-medium" style={{ color: 'var(--color-muted)' }}>
                {TIME_SLOT_LABELS[slot]}
              </span>
            </div>

            {/* Cells */}
            {weekDays.map((day) => {
              const dateStr = toISODate(day)
              const isRest = restDays.has(dateStr)
              return (
                <div key={dateStr} className="relative min-w-0">
                  <SlotCell
                    date={dateStr}
                    timeSlot={slot}
                    sessions={sessions}
                    events={events}
                    showEvents={slotIdx === 0}
                    hideAddButton={isRest}
                    onAdd={onAdd}
                    onMarkDone={onMarkDone}
                    onUndo={onUndo}
                    onRemove={onRemove}
                  />
                  {/* Rest day overlay */}
                  {isRest && (
                    <div
                      className="absolute inset-0 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-surface-2)', opacity: 0.7 }}
                    >
                      {slotIdx === Math.floor(visibleSlots.length / 2) && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                          Rest
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
