'use client'

import { ALL_TIME_SLOTS, TIME_SLOT_LABELS, type TimeSlot } from '@/types'

interface TimeSlotTogglesProps {
  visible: TimeSlot[]
  onChange: (slots: TimeSlot[]) => void
}

export function TimeSlotToggles({ visible, onChange }: TimeSlotTogglesProps) {
  function toggle(slot: TimeSlot) {
    const isOn = visible.includes(slot)
    if (isOn && visible.length === 1) return // must keep at least one
    const next = isOn ? visible.filter(s => s !== slot) : [...visible, slot]
    // Preserve order
    onChange(ALL_TIME_SLOTS.filter(s => next.includes(s)))
  }

  return (
    <div className="flex flex-col gap-2">
      {ALL_TIME_SLOTS.map(slot => {
        const isOn = visible.includes(slot)
        const isLast = visible.length === 1 && isOn
        return (
          <button
            key={slot}
            onClick={() => toggle(slot)}
            disabled={isLast}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all disabled:opacity-40"
            style={{
              backgroundColor: isOn ? '#84cc1615' : 'var(--color-surface-2)',
              border: isOn ? '1.5px solid #84cc1650' : '1.5px solid transparent',
            }}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {TIME_SLOT_LABELS[slot]}
            </span>
            <div
              className="w-10 h-5 rounded-full relative transition-colors"
              style={{ backgroundColor: isOn ? '#84cc16' : 'var(--color-border)' }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ transform: isOn ? 'translateX(22px)' : 'translateX(2px)' }}
              />
            </div>
          </button>
        )
      })}
      <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
        At least one time slot must be visible.
      </p>
    </div>
  )
}
