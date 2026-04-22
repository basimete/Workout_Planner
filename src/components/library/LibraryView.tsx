'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useLibrary } from '@/hooks/useLibrary'
import { ActivityRow } from './ActivityRow'
import { AddActivityModal } from './AddActivityModal'
import { Button } from '@/components/ui/Button'

export function LibraryView() {
  const { categories, loading, error, addCategory, deleteCategory, addActivity, deleteActivity, hideActivity } = useLibrary()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)

  function toggleCategory(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 rounded-full border-2 border-lime-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-500">{error}</div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>Activity Library</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Tap a cell in the planner to pick from these activities
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus size={14} />
          Add
        </Button>
      </div>

      {/* Category list */}
      <div className="flex flex-col gap-2">
        {categories.map(cat => {
          const isExpanded = expanded.has(cat.id)
          const isSystem = cat.user_id === null
          return (
            <div
              key={cat.id}
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="flex-1 text-sm font-semibold text-left" style={{ color: 'var(--color-text)' }}>
                  {cat.name}
                </span>
                <span className="text-xs mr-2" style={{ color: 'var(--color-muted)' }}>
                  {cat.activities.length}
                </span>
                {!isSystem && (
                  <button
                    onClick={e => { e.stopPropagation(); deleteCategory(cat.id) }}
                    className="p-1 rounded hover:text-red-500 transition-colors mr-1"
                    style={{ color: 'var(--color-muted)' }}
                    title="Delete category"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
                {isExpanded
                  ? <ChevronDown size={16} style={{ color: 'var(--color-muted)' }} />
                  : <ChevronRight size={16} style={{ color: 'var(--color-muted)' }} />
                }
              </button>

              {/* Activities */}
              {isExpanded && (
                <div className="px-4 pb-4 flex flex-col gap-1.5">
                  {cat.activities.length === 0 ? (
                    <p className="text-xs py-2" style={{ color: 'var(--color-muted)' }}>
                      No activities — add one above
                    </p>
                  ) : (
                    cat.activities.map(act => (
                      <ActivityRow
                        key={act.id}
                        activity={act}
                        isSystem={act.user_id === null}
                        onHide={hideActivity}
                        onDelete={deleteActivity}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <AddActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        onAddCategory={addCategory}
        onAddActivity={addActivity}
      />
    </div>
  )
}
