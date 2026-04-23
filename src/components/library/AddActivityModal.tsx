'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { CategoryWithActivities } from '@/hooks/useLibrary'

const PRESET_COLORS = [
  '#84cc16', '#f97316', '#6366f1', '#3b82f6',
  '#06b6d4', '#a855f7', '#ef4444', '#f59e0b',
  '#ec4899', '#14b8a6',
]

interface AddActivityModalProps {
  open: boolean
  onClose: () => void
  categories: CategoryWithActivities[]
  onAddCategory: (name: string, color: string) => Promise<void>
  onAddActivity: (categoryId: string, name: string) => Promise<void>
}

export function AddActivityModal({
  open, onClose, categories, onAddCategory, onAddActivity,
}: AddActivityModalProps) {
  const [mode, setMode] = useState<'activity' | 'category'>('activity')
  const [categoryId, setCategoryId] = useState('')
  const [activityName, setActivityName] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [categoryColor, setCategoryColor] = useState('#84cc16')
  const [saving, setSaving] = useState(false)

  function reset() {
    setMode('activity')
    setCategoryId('')
    setActivityName('')
    setCategoryName('')
    setCategoryColor('#84cc16')
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    if (mode === 'category') {
      await onAddCategory(categoryName.trim(), categoryColor)
    } else {
      await onAddActivity(categoryId, activityName.trim())
    }
    setSaving(false)
    handleClose()
  }

  const userCategories = categories.filter(c => c.user_id !== null)

  return (
    <Modal open={open} onClose={handleClose} title="Add to Library">
      {/* Mode toggle */}
      <div
        className="flex rounded-xl p-1 mb-5"
        style={{ backgroundColor: 'var(--color-surface-2)' }}
      >
        {(['activity', 'category'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
            style={{
              backgroundColor: mode === m ? 'var(--color-surface)' : 'transparent',
              color: mode === m ? 'var(--color-text)' : 'var(--color-muted)',
              boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {m === 'activity' ? 'New Activity' : 'New Category'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'activity' ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Category
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
                className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="">Select category…</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Activity name
              </label>
              <input
                type="text"
                value={activityName}
                onChange={e => setActivityName(e.target.value)}
                placeholder="e.g. Easy Run"
                required
                className="w-full rounded-xl px-4 py-2.5 border outline-none"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '16px',
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Category name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                placeholder="e.g. Pilates"
                required
                className="w-full rounded-xl px-4 py-2.5 border outline-none"
                style={{
                  backgroundColor: 'var(--color-surface-2)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '16px',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                Colour
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategoryColor(c)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      outline: categoryColor === c ? `2px solid ${c}` : 'none',
                      outlineOffset: '2px',
                    }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Saving…' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
