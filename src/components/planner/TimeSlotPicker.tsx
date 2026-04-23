'use client'

import { BottomSheet } from '@/components/ui/BottomSheet'
import { TIME_SLOT_LABELS } from '@/types'
import type { TimeSlot } from '@/types'

interface TimeSlotPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (slot: TimeSlot) => void
  visibleSlots: TimeSlot[]
}

export function TimeSlotPicker({ open, onClose, onSelect, visibleSlots }: TimeSlotPickerProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title="When?">
      <div className="flex flex-col gap-3">
        {visibleSlots.map(slot => (
          <button
            key={slot}
            type="button"
            onClick={() => onSelect(slot)}
            className="w-full rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-opacity active:opacity-60"
            style={{
              backgroundColor: 'var(--color-surface-2)',
              color: 'var(--color-text)',
            }}
          >
            {TIME_SLOT_LABELS[slot]}
          </button>
        ))}
      </div>
    </BottomSheet>
  )
}
