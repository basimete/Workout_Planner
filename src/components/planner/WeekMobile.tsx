'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Moon, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import { ActivityChip } from './ActivityChip'
import { formatDayFull, isToday, toISODate } from '@/lib/dates'
import { TIME_SLOT_LABELS, ALL_TIME_SLOTS } from '@/types'
import type { PlannedSession, Event } from '@/types'

interface WeekMobileProps {
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

export function WeekMobile({
  weekDays, sessions, events, restDays,
  onAdd, onMarkDone, onUndo, onRemove, onToggleRest,
}: WeekMobileProps) {
  const allDates = weekDays.map(d => toISODate(d))

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const todayISO = toISODate(new Date())
    return new Set([todayISO])
  })

  function toggle(dateStr: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(dateStr) ? next.delete(dateStr) : next.add(dateStr)
      return next
    })
  }

  function expandAll() { setExpanded(new Set(allDates)) }
  function collapseAll() { setExpanded(new Set()) }

  const allExpanded = allDates.every(d => expanded.has(d))
  const noneExpanded = allDates.every(d => !expanded.has(d))

  return (
    <div>
      {/* Expand / collapse all */}
      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={expandAll}
          disabled={allExpanded}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-opacity disabled:opacity-30"
          style={{ color: 'var(--color-muted)', backgroundColor: 'var(--color-surface)' }}
        >
          <ChevronsUpDown size={12} />
          Expand all
        </button>
        <button
          onClick={collapseAll}
          disabled={noneExpanded}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-opacity disabled:opacity-30"
          style={{ color: 'var(--color-muted)', backgroundColor: 'var(--color-surface)' }}
        >
          <ChevronsDownUp size={12} />
          Collapse all
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {weekDays.map(day => {
          const dateStr = toISODate(day)
          const today = isToday(day)
          const isExpanded = expanded.has(dateStr)
          const isRest = restDays.has(dateStr)
          const daySessions = sessions.filter(s => s.date === dateStr)
          const dayEvents = events.filter(e =>
            dateStr >= e.start_date && dateStr <= (e.end_date ?? e.start_date)
          )
          // Only render groups for slots that actually have sessions
          const slotGroups = ALL_TIME_SLOTS
            .map(slot => ({ slot, sessions: daySessions.filter(s => s.time_slot === slot) }))
            .filter(g => g.sessions.length > 0)

          return (
            <div
              key={dateStr}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: isRest ? 'var(--color-surface-2)' : 'var(--color-surface)',
                border: today && !isRest ? '1.5px solid #84cc16' : '1px solid var(--color-border)',
                opacity: isRest ? 0.75 : 1,
              }}
            >
              {/* Day header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <button onClick={() => toggle(dateStr)} className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: isRest ? 'var(--color-border)' : today ? '#84cc16' : 'var(--color-surface-2)',
                      color: isRest ? 'var(--color-muted)' : today ? 'white' : 'var(--color-text)',
                    }}
                  >
                    {day.getDate()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: isRest ? 'var(--color-muted)' : today ? '#84cc16' : 'var(--color-text)',
                      }}
                    >
                      {formatDayFull(day)}
                    </p>
                    {isRest ? (
                      <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Rest day</p>
                    ) : !isExpanded && daySessions.length > 0 ? (
                      <p className="text-xs truncate" style={{ color: 'var(--color-text)' }}>
                        {daySessions.map(s => s.activity_name).join(', ')}
                      </p>
                    ) : null}
                  </div>
                </button>

                {dayEvents.length > 0 && !isRest && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0"
                    style={{ backgroundColor: '#84cc1620', color: '#166534' }}
                  >
                    {dayEvents[0].name}
                  </span>
                )}

                <button
                  onClick={() => onToggleRest(dateStr)}
                  className="flex-shrink-0 p-1.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: isRest ? 'var(--color-border)' : 'transparent',
                    color: isRest ? 'var(--color-text)' : 'var(--color-border)',
                  }}
                  title={isRest ? 'Remove rest day' : 'Mark as rest day'}
                >
                  <Moon size={14} />
                </button>

                {!isRest && (
                  <button onClick={() => toggle(dateStr)} className="flex-shrink-0">
                    {isExpanded
                      ? <ChevronDown size={16} style={{ color: 'var(--color-muted)' }} />
                      : <ChevronRight size={16} style={{ color: 'var(--color-muted)' }} />
                    }
                  </button>
                )}
              </div>

              {/* Expanded content — only renders slots that have sessions */}
              {isExpanded && !isRest && (
                <div className="px-4 pb-4 flex flex-col gap-3">
                  {/* Event banners */}
                  {dayEvents.map(evt => (
                    <div
                      key={evt.id}
                      className="rounded-xl px-3 py-2"
                      style={{ backgroundColor: '#84cc1620', border: '1px solid #84cc1640' }}
                    >
                      <p className="text-xs font-semibold" style={{ color: '#166534' }}>{evt.name}</p>
                      {evt.notes && (
                        <p className="text-[10px] mt-0.5" style={{ color: '#15803d' }}>{evt.notes}</p>
                      )}
                    </div>
                  ))}

                  {/* Slot groups — only slots with sessions are shown */}
                  {slotGroups.map(({ slot, sessions: slotSessions }, idx) => {
                    const isLast = idx === slotGroups.length - 1
                    return (
                      <div key={slot} className="flex flex-col gap-1">
                        <p
                          className="text-[10px] font-semibold uppercase tracking-wide"
                          style={{ color: 'var(--color-muted)' }}
                        >
                          {TIME_SLOT_LABELS[slot]}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {slotSessions.map(s => (
                            <div key={s.id} className="min-w-0 max-w-[220px]">
                              <ActivityChip
                                session={s}
                                onMarkDone={onMarkDone}
                                onUndo={onUndo}
                                onRemove={onRemove}
                              />
                            </div>
                          ))}
                          {/* Add button inline with chips on the last group */}
                          {isLast && (
                            <button
                              onClick={() => onAdd(dateStr)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] flex-shrink-0"
                              style={{ color: 'var(--color-muted)' }}
                            >
                              <Plus size={11} />
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
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] self-start"
                      style={{ color: 'var(--color-muted)' }}
                    >
                      <Plus size={11} />
                      Add activity
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
