'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
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

  function handleSelect(activity: Activity) {
    onSelect(activity)
    setQuery('')
    onClose()
  }

  function handleSelectCategory(cat: typeof categories[number]) {
    // Treat the category itself as a selectable activity
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
      {/* Search — font-size 16px prevents iOS zoom */}
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
          autoFocus
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
        <div className="flex flex-col gap-4">
          {filtered.map(cat => (
            <div key={cat.id}>
              {/* Category header — tappable to select the category itself */}
              <button
                onClick={() => handleSelectCategory(cat)}
                className="flex items-center gap-2 mb-2 w-full rounded-lg px-2 py-1 -mx-2 text-left hover:opacity-70 transition-opacity"
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>
                  {cat.name}
                </span>
              </button>

              {/* Individual activities */}
              <div className="flex flex-col gap-1.5">
                {cat.activities.map(act => (
                  <button
                    key={act.id}
                    onClick={() => handleSelect(act)}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-opacity hover:opacity-70"
                    style={{ backgroundColor: 'var(--color-surface-2)' }}
                  >
                    <div className="w-1 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm" style={{ color: 'var(--color-text)' }}>{act.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </BottomSheet>
  )
}
