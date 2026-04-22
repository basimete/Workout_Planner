import type { CategoryStat } from '@/hooks/useSummary'

interface CategoryBreakdownProps {
  stats: CategoryStat[]
  total: number
}

export function CategoryBreakdown({ stats, total }: CategoryBreakdownProps) {
  if (stats.length === 0) {
    return (
      <p className="text-sm py-4 text-center" style={{ color: 'var(--color-muted)' }}>
        No completed sessions this month
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {stats.map(stat => {
        const pct = total === 0 ? 0 : Math.round((stat.count / total) * 100)
        return (
          <div key={stat.name}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {stat.name}
                </span>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-muted)' }}>
                {stat.count}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-2)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: stat.color }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
