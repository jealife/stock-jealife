import { getPhotos } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap() {
    const baseUrl = 'https://stock-jealife.vercel.app'

    // 1. Fetch all photos
    const photos = await getPhotos()
    const photoUrls = photos.map((photo) => ({
        url: `${baseUrl}/photo/${photo.id}`,
        lastModified: photo.updated_at || photo.created_at,
    }))

    // 2. Fetch all user profiles
    const supabase = await createClient()
    const { data: profiles } = await supabase.from('profiles').select('username, updated_at')
    const profileUrls = (profiles || []).map((profile) => ({
        url: `${baseUrl}/users/${profile.username}`,
        lastModified: profile.updated_at,
    }))

    // 3. Static routes
    const routes = ['', '/search', '/about', '/contact', '/privacy', '/terms'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
    }))

    return [...routes, ...photoUrls, ...profileUrls]
}
