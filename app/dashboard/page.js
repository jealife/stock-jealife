import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserStats } from '@/lib/data'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const stats = await getUserStats(user.id)

    return <DashboardContent user={user} stats={stats} recentSales={stats.sales} />
}
