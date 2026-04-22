'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface AddEventModalProps {
  open: boolean
  onClose: () => void
  defaultDate?: string
  onAdd: (name: string, startDate: string, endDate: string | null, notes: string | null) => Promise<void>
}

export function AddEventModal({ open, onClose, defaultDate, onAdd }: AddEventModalProps) {
  const today = defaultDate ?? new Date().toISOString().split('T')[0]
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  function reset() {
    setName('')
    setStartDate(today)
    setEndDate('')
    setNotes('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onAdd(name.trim(), startDate, endDate || null, notes.trim() || null)
    setSaving(false)
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={() => { reset(); onClose() }} title="Add Event">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            Event name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. 5k Race, Weekend Tournament"
            required
            autoFocus
            className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              End date <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none"
              style={{
                backgroundColor: 'var(--color-surface-2)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
            Notes <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any details…"
            rows={2}
            className="w-full rounded-xl px-4 py-2.5 text-sm border outline-none resize-none"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={() => { reset(); onClose() }} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving} className="flex-1">
            {saving ? 'Saving…' : 'Add Event'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
