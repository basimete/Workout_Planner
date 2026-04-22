'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category, Activity } from '@/types'

export interface CategoryWithActivities extends Category {
  activities: Activity[]
}

export function useLibrary() {
  const [categories, setCategories] = useState<CategoryWithActivities[]>([])
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const [catsRes, actsRes, hiddenRes] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('activities').select('*').order('name'),
      supabase.from('hidden_activities').select('activity_id'),
    ])

    if (catsRes.error) { setError(catsRes.error.message); setLoading(false); return }
    if (actsRes.error) { setError(actsRes.error.message); setLoading(false); return }

    const hidden = new Set((hiddenRes.data ?? []).map(r => r.activity_id as string))
    setHiddenIds(hidden)

    const actsByCategory = new Map<string, Activity[]>()
    for (const act of (actsRes.data ?? [])) {
      if (!actsByCategory.has(act.category_id)) actsByCategory.set(act.category_id, [])
      actsByCategory.get(act.category_id)!.push(act as Activity)
    }

    const result: CategoryWithActivities[] = (catsRes.data ?? []).map(cat => {
      const category = cat as Category
      return {
        ...category,
        activities: (actsByCategory.get(cat.id) ?? [])
          .filter(a => !hidden.has(a.id))
          .map(a => ({ ...a, category })),
      }
    })

    setCategories(result)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function addCategory(name: string, color: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('categories').insert({ name, color, user_id: user.id })
    await load()
  }

  async function deleteCategory(id: string) {
    const supabase = createClient()
    await supabase.from('categories').delete().eq('id', id)
    await load()
  }

  async function addActivity(categoryId: string, name: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('activities').insert({ category_id: categoryId, name, user_id: user.id })
    await load()
  }

  async function deleteActivity(id: string) {
    const supabase = createClient()
    await supabase.from('activities').delete().eq('id', id)
    await load()
  }

  async function hideActivity(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('hidden_activities').insert({ user_id: user.id, activity_id: id })
    setHiddenIds(prev => new Set([...prev, id]))
    setCategories(prev =>
      prev.map(cat => ({
        ...cat,
        activities: cat.activities.filter(a => a.id !== id),
      }))
    )
  }

  async function unhideActivity(id: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('hidden_activities').delete().eq('user_id', user.id).eq('activity_id', id)
    await load()
  }

  return { categories, hiddenIds, loading, error, addCategory, deleteCategory, addActivity, deleteActivity, hideActivity, unhideActivity, reload: load }
}
