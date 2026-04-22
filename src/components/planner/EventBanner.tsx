import type { Event } from '@/types'

interface EventBannerProps {
  event: Event
}

export function EventBanner({ event }: EventBannerProps) {
  const isMultiDay = event.end_date && event.end_date !== event.start_date

  return (
    <div
      className="rounded-lg px-2.5 py-1.5 w-full"
      style={{ backgroundColor: '#84cc1620', border: '1px solid #84cc1640' }}
      title={event.notes ?? event.name}
    >
      <p className="text-xs font-semibold truncate" style={{ color: '#166534' }}>
        {event.name}
      </p>
      {isMultiDay && (
        <p className="text-[10px]" style={{ color: '#15803d' }}>
          multi-day
        </p>
      )}
    </div>
  )
}
