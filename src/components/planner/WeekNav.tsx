'use client'

import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { formatMonthYear, toISODate, getWeekDays } from '@/lib/dates'

interface WeekNavProps {
  monday: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function WeekNav({ monday, onPrev, onNext, onToday }: WeekNavProps) {
  const days = getWeekDays(monday)
  const sunday = days[6]
  const label = monday.getMonth() === sunday.getMonth()
    ? formatMonthYear(monday)
    : `${monday.toLocaleDateString('en-GB', { month: 'short' })} – ${formatMonthYear(sunday)}`

  const isCurrentWeek = toISODate(monday) === toISODate(
    (() => { const d = new Date(); const day = d.getDay(); d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); d.setHours(0,0,0,0); return d })()
  )

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="p-2 rounded-xl hover:opacity-70 transition-opacity"
        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        aria-label="Previous week"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex-1 text-center">
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {label}
        </span>
      </div>

      {!isCurrentWeek && (
        <button
          onClick={onToday}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium"
          style={{ backgroundColor: '#84cc1620', color: '#84cc16' }}
        >
          <CalendarDays size={13} />
          Today
        </button>
      )}

      <button
        onClick={onNext}
        className="p-2 rounded-xl hover:opacity-70 transition-opacity"
        style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
        aria-label="Next week"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
