'use client'

import { EyeOff, Trash2 } from 'lucide-react'
import type { Activity } from '@/types'

interface ActivityRowProps {
  activity: Activity
  isSystem: boolean
  onHide: (id: string) => void
  onDelete: (id: string) => void
}

export function ActivityRow({ activity, isSystem, onHide, onDelete }: ActivityRowProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-2.5 rounded-xl group"
      style={{ backgroundColor: 'var(--color-surface-2)' }}
    >
      <span className="text-sm" style={{ color: 'var(--color-text)' }}>
        {activity.name}
      </span>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isSystem ? (
          <button
            onClick={() => onHide(activity.id)}
            className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-muted)' }}
            title="Hide from library"
          >
            <EyeOff size={14} />
          </button>
        ) : (
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1.5 rounded-lg hover:text-red-500 transition-colors"
            style={{ color: 'var(--color-muted)' }}
            title="Delete activity"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
