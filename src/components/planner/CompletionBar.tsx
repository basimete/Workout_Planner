interface CompletionBarProps {
  completed: number
  total: number
}

export function CompletionBar({ completed, total }: CompletionBarProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            {completed === 0 && total === 0
              ? 'No sessions this week'
              : `${completed} of ${total} session${total !== 1 ? 's' : ''} completed`}
          </span>
          {total > 0 && (
            <span className="text-xs font-semibold" style={{ color: '#84cc16' }}>
              {pct}%
            </span>
          )}
        </div>
        {total > 0 && (
          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: '#84cc16' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
