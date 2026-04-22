'use client'

import { useState } from 'react'
import { getMonday } from '@/lib/dates'

export function useWeekNav() {
  const [monday, setMonday] = useState<Date>(() => getMonday(new Date()))

  function prevWeek() {
    setMonday(d => {
      const next = new Date(d)
      next.setDate(next.getDate() - 7)
      return next
    })
  }

  function nextWeek() {
    setMonday(d => {
      const next = new Date(d)
      next.setDate(next.getDate() + 7)
      return next
    })
  }

  function goToToday() {
    setMonday(getMonday(new Date()))
  }

  return { monday, prevWeek, nextWeek, goToToday }
}
