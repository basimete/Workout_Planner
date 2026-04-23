'use client'

import { Plus } from 'lucide-react'
import { ActivityChip } from './ActivityChip'
import { EventBanner } from './EventBanner'
import { formatDayShort, formatDayNum, isToday, toISODate } from '@/lib/dates'
import { TIME_SLOT_LABELS, ALL_TIME_SLOTS } from '@/types'
import type { PlannedSession, Event } from '@/types'

interface WeekGridProps {
  weekDays: Date[]
  sessions: PlannedSession[]
  events: Event[]
  restDays: Set<string>
  onAdd: (date: string) => void
  onMarkDone: (id: string) => void
  onUndo: (id: string) => void
  onRemove: (id: string) => void
  onToggleRest: (date: string) => void
}

export function WeekGrid({
  weekDays, sessions, events, restDays,
  onAdd, onMarkDone, onUndo, onRemove, onToggleRest,
}: WeekGridProps) {
  const colTemplate = `repeat(${weekDays.length}, 1fr)`

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: '560px' }}>
        {/* Day headers */}
        <div
          className="grid sticky top-0 z-10 mb-2"
          style={{ gridTemplateColumns: colTemplate, backgroundColor: 'var(--color-bg)' }}
        >
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

        {/* Day columns — blank canvas, only renders groups that have sessions */}
        <div
          className="grid items-start gap-2"
          style={{ gridTemplateColumns: colTemplate }}
        >
          {weekDays.map(day => {
            const dateStr = toISODate(day)
            const isRest = restDays.has(dateStr)
            const daySessions = sessions.filter(s => s.date === dateStr)
            const dayEvents = events.filter(e =>
              dateStr >= e.start_date && dateStr <= (e.end_date ?? e.start_date)
            )
            const slotGroups = ALL_TIME_SLOTS
              .map(slot => ({ slot, sessions: daySessions.filter(s => s.time_slot === slot) }))
              .filter(g => g.sessions.length > 0)

            return (
              <div
                key={dateStr}
                className="min-w-0 rounded-xl p-2 flex flex-col gap-2"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  opacity: isRest ? 0.6 : 1,
                  minHeight: '60px',
                }}
              >
                {isRest ? (
                  <div className="flex items-center justify-center py-4">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      Rest
                    </span>
                  </div>
                ) : (
                  <>
                    {dayEvents.map(evt => (
                      <EventBanner key={evt.id} event={evt} />
                    ))}

                    {slotGroups.map(({ slot, sessions: slotSessions }, idx) => {
                      const isLast = idx === slotGroups.length - 1
                      return (
                        <div key={slot}>
                          <p
                            className="text-[10px] font-semibold uppercase tracking-wide mb-1"
                            style={{ color: 'var(--color-muted)' }}
                          >
                            {TIME_SLOT_LABELS[slot]}
                          </p>
                          <div className="flex flex-col gap-1">
                            {slotSessions.map(s => (
                              <ActivityChip
                                key={s.id}
                                session={s}
                                onMarkDone={onMarkDone}
                                onUndo={onUndo}
                                onRemove={onRemove}
                              />
                            ))}
                            {/* Add button inline after the last chip in the last group */}
                            {isLast && (
                              <button
                                onClick={() => onAdd(dateStr)}
                                className="flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] self-start transition-opacity hover:opacity-70"
                                style={{ color: 'var(--color-muted)' }}
                              >
                                <Plus size={10} />
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {/* Standalone add button only when day is empty */}
                    {slotGroups.length === 0 && (
                      <button
                        onClick={() => onAdd(dateStr)}
                        className="flex items-center gap-1 w-full justify-center py-1 rounded-lg text-[11px] transition-opacity hover:opacity-70"
                        style={{ color: 'var(--color-muted)' }}
                      >
                        <Plus size={11} />
                        Add
                      </button>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
