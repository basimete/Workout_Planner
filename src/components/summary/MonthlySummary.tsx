'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, Activity } from 'lucide-react'
import { useSummary } from '@/hooks/useSummary'
import { MiniCalendar } from './MiniCalendar'
import { CategoryBreakdown } from './CategoryBreakdown'

function formatMonthYear(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

export function MonthlySummary() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const { loading, totalCompleted, activeDays, categoryStats, completedByDay, eventsByDay } = useSummary(year, month)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header + month nav */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Summary</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-xl hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-muted)' }}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium w-32 text-center" style={{ color: 'var(--color-text)' }}>
            {formatMonthYear(year, month)}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-xl hover:opacity-70 transition-opacity disabled:opacity-30"
            style={{ color: 'var(--color-muted)' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#84cc16', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} style={{ color: '#84cc16' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Sessions</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{totalCompleted}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>completed</p>
            </div>
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity size={16} style={{ color: '#84cc16' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>Active days</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{activeDays}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>this month</p>
            </div>
          </div>

          {/* Calendar */}
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              {formatMonthYear(year, month)}
            </h2>
            <MiniCalendar
              year={year}
              month={month}
              completedByDay={completedByDay}
              eventsByDay={eventsByDay}
            />
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#84cc16' }} />
                <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Session</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#166534' }} />
                <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Event</span>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div
            className="rounded-2xl p-4"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>By category</h2>
            <CategoryBreakdown stats={categoryStats} total={totalCompleted} />
          </div>
        </div>
      )}
    </div>
  )
}
