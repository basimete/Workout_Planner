'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useLibrary } from '@/hooks/useLibrary'
import type { Activity } from '@/types'

interface ActivityPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (activity: Activity) => void
}

export function ActivityPicker({ open, onClose, onSelect }: ActivityPickerProps) {
  const { categories, loading } = useLibrary()
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const filtered = categories.map(cat => ({
    ...cat,
    activities: cat.activities.filter(a =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      cat.name.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(cat =>
    cat.activities.length > 0 ||
    cat.name.toLowerCase().includes(query.toLowerCase())
  )

  function toggleCollapse(catId: string) {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(catId) ? next.delete(catId) : next.add(catId)
      return next
    })
  }

  function handleSelect(activity: Activity) {
    onSelect(activity)
    setQuery('')
    setCollapsed(new Set())
    onClose()
  }

  function handleSelectCategory(cat: typeof categories[number]) {
    handleSelect({
      id: cat.id,
      category_id: cat.id,
      name: cat.name,
      user_id: null,
      category: { id: cat.id, name: cat.name, color: cat.color, user_id: null },
    })
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Pick an activity">
      {/* Search — no autoFocus, 16px prevents iOS zoom */}
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2 mb-4"
        style={{ backgroundColor: 'var(--color-surface-2)' }}
      >
        <Search size={15} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search activities…"
          className="flex-1 bg-transparent outline-none"
          style={{ color: 'var(--color-text)', fontSize: '16px' }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 rounded-full border-2 border-lime-500 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: 'var(--color-muted)' }}>
          No activities found
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(cat => {
            const isCollapsed = collapsed.has(cat.id)
            return (
              <div key={cat.id}>
                {/* Category header — tap to collapse/expand */}
                <button
                  type="button"
                  onClick={() => toggleCollapse(cat.id)}
                  className="flex items-center gap-2 w-full py-1.5 text-left"
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="flex-1 text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                    {cat.name}
                  </span>
                  {isCollapsed
                    ? <ChevronRight size={14} style={{ color: 'var(--color-muted)' }} />
                    : <ChevronDown size={14} style={{ color: 'var(--color-muted)' }} />
                  }
                </button>

                {!isCollapsed && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    {/* Select category itself (no sub-type) */}
                    <button
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-opacity active:opacity-60"
                      style={{ backgroundColor: `${cat.color}18` }}
                    >
                      <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-medium" style={{ color: cat.color }}>{cat.name}</span>
                    </button>

                    {/* Individual activities */}
                    {cat.activities.map(act => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleSelect(act)}
                        className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-opacity active:opacity-60"
                        style={{ backgroundColor: 'var(--color-surface-2)' }}
                      >
                        <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm" style={{ color: 'var(--color-text)' }}>{act.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </BottomSheet>
  )
}
