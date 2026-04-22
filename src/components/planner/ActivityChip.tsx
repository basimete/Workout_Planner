'use client'

import { X } from 'lucide-react'
import type { PlannedSession } from '@/types'

interface ActivityChipProps {
  session: PlannedSession
  onMarkDone: (id: string) => void
  onUndo: (id: string) => void
  onRemove: (id: string) => void
}

export function ActivityChip({ session, onMarkDone, onUndo, onRemove }: ActivityChipProps) {
  const done = session.status === 'completed'

  function toggleDone(e: React.MouseEvent) {
    e.stopPropagation()
    done ? onUndo(session.id) : onMarkDone(session.id)
  }

  return (
    <div
      className="flex items-center gap-2 rounded-xl px-2.5 py-2 group/chip select-none transition-opacity"
      style={{
        backgroundColor: 'var(--color-surface-2)',
        borderLeft: `3px solid ${session.category_color}`,
        opacity: done ? 0.55 : 1,
      }}
    >
      {/* Checkbox */}
      <button
        onClick={toggleDone}
        aria-label={done ? 'Mark as planned' : 'Mark as done'}
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: done ? '#84cc16' : 'var(--color-border)',
          backgroundColor: done ? '#84cc16' : 'transparent',
        }}
      >
        {done && (
          <svg
            className="tick-animate"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M1.5 5L4 7.5L8.5 2.5"
              stroke="white"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Labels */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-medium truncate"
          style={{
            color: 'var(--color-text)',
            textDecoration: done ? 'line-through' : 'none',
          }}
        >
          {session.activity_name}
        </p>
        <p className="text-[10px] truncate" style={{ color: 'var(--color-muted)' }}>
          {session.category_name}
        </p>
      </div>

      {/* Remove — visible on hover */}
      <button
        onClick={e => { e.stopPropagation(); onRemove(session.id) }}
        aria-label="Remove"
        className="flex-shrink-0 opacity-0 group-hover/chip:opacity-100 transition-opacity p-0.5 rounded hover:text-red-400"
        style={{ color: 'var(--color-muted)' }}
      >
        <X size={12} />
      </button>
    </div>
  )
}
