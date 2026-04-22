export type TimeSlot = 'Morning' | 'Lunchtime' | 'AfterWork' | 'Evening'
export type SessionStatus = 'planned' | 'completed'
export type Theme = 'light' | 'dark' | 'system'

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  Morning:  'Morning',
  Lunchtime: 'Lunchtime',
  AfterWork: 'After Work',
  Evening:  'Evening',
}

export const ALL_TIME_SLOTS: TimeSlot[] = ['Morning', 'Lunchtime', 'AfterWork', 'Evening']

export interface Category {
  id: string
  name: string
  color: string
  user_id: string | null  // null = system starter
}

export interface Activity {
  id: string
  category_id: string
  name: string
  user_id: string | null  // null = system starter
  category?: Category
}

export interface PlannedSession {
  id: string
  user_id: string
  activity_id: string | null
  activity_name: string
  category_name: string
  category_color: string
  date: string           // YYYY-MM-DD
  time_slot: TimeSlot
  status: SessionStatus
  display_order: number
  notes: string | null
  created_at: string
}

export interface Event {
  id: string
  user_id: string
  name: string
  start_date: string     // YYYY-MM-DD
  end_date: string | null
  notes: string | null
  created_at: string
}

export interface UserSettings {
  user_id: string
  visible_time_slots: TimeSlot[]
  theme: Theme
  updated_at: string
}
