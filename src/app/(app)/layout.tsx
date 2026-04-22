import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/nav/BottomNav'
import { TopNav } from '@/components/nav/TopNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-dvh">
      <TopNav email={user?.email} />
      {/* Main content — bottom padding for mobile nav */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
