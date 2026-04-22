'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full rounded-t-2xl"
        style={{
          backgroundColor: 'var(--color-surface)',
          maxHeight: '85dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 -mr-1.5 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-muted)' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-5 pb-8" style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}
