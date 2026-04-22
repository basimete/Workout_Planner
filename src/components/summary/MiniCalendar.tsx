'use client'

import { getMonthCalendarDays, toISODate } from '@/lib/dates'
import type { Event } from '@/types'

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface MiniCalendarProps {
  year: number
  month: number
  completedByDay: Record<string, number>
  eventsByDay: Record<string, Event[]>
}

export function MiniCalendar({ year, month, completedByDay, eventsByDay }: MiniCalendarProps) {
  const days = getMonthCalendarDays(year, month)
  const today = toISODate(new Date())

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold py-1" style={{ color: 'var(--color-muted)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map(day => {
          const iso = toISODate(day)
          const inMonth = day.getMonth() === month
          const isToday = iso === today
          const completedCount = completedByDay[iso] ?? 0
          const hasEvent = !!(eventsByDay[iso]?.length)

          return (
            <div
              key={iso}
              className="aspect-square flex flex-col items-center justify-center rounded-xl relative"
              style={{
                backgroundColor: isToday ? '#84cc1615' : 'transparent',
                opacity: inMonth ? 1 : 0.3,
              }}
            >
              <span
                className="text-xs"
                style={{
                  color: isToday ? '#84cc16' : 'var(--color-text)',
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {day.getDate()}
              </span>

              {/* Dots row */}
              <div className="flex items-center gap-0.5 mt-0.5 h-1.5">
                {completedCount > 0 && (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#84cc16' }}
                    title={`${completedCount} session${completedCount > 1 ? 's' : ''}`}
                  />
                )}
                {hasEvent && (
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#166534' }}
                    title={eventsByDay[iso].map(e => e.name).join(', ')}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
