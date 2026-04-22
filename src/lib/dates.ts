/** Returns the Monday of the week containing `date` */
export function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Returns 7 Date objects (Mon–Sun) for the week starting at `monday` */
export function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return d
  })
}

/** Returns all Date objects in the given month, padded to full weeks */
export function getMonthCalendarDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startMonday = getMonday(firstDay)
  // Pad to end of the week containing lastDay
  const endSunday = new Date(lastDay)
  const endDay = endSunday.getDay()
  if (endDay !== 0) endSunday.setDate(endSunday.getDate() + (7 - endDay))

  const days: Date[] = []
  const cur = new Date(startMonday)
  while (cur <= endSunday) {
    days.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

/** Converts a Date to "YYYY-MM-DD" (local time) */
export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** "Mon 15 Apr" */
export function formatDay(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** "Mon" */
export function formatDayShort(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'short' })
}

/** "Monday 15 Apr" */
export function formatDayFull(date: Date): string {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
}

/** "April 2026" */
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

/** "15" */
export function formatDayNum(date: Date): string {
  return String(date.getDate())
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return toISODate(date) === toISODate(today)
}

/** Returns true if `isoDate` falls within [startISO, endISO] inclusive */
export function isDateInRange(isoDate: string, startISO: string, endISO: string): boolean {
  return isoDate >= startISO && isoDate <= endISO
}
