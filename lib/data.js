import { createClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

export async function getPhotos() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('photos')
        .select(`
      *,
      creator:profiles!photographer_id (
        id,
        username,
        full_name,
        avatar_url,
        available_for_hire
      )
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching photos:', error)
        return []
    }

    // Transform data to match component expectations
    return data.map(photo => ({
        ...photo,
        creator: {
            ...photo.creator,
            name: photo.creator?.full_name || 'Unknown',
            avatar: photo.creator?.avatar_url || null,
            available: photo.creator?.available_for_hire
        },
        thumbnail: photo.url_thumbnail,
    }))
}

export async function getPhoto(id) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('photos')
        .select(`
      *,
      creator:profiles!photographer_id (
        id,
        username,
        full_name,
        avatar_url,
        available_for_hire,
        bio,
        location
      )
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error(`Error fetching photo ${id}:`, error)
        return null
    }

    return {
        ...data,
        creator: {
            ...data.creator,
            name: data.creator?.full_name || 'Unknown',
            avatar: data.creator?.avatar_url || null,
            available: data.creator?.available_for_hire,
            bio: data.creator?.bio,
            location: data.creator?.location,
            specs: { // Mapped for Photo Details
                camera: data.camera_model,
                location: data.location,
                published: new Date(data.created_at).toLocaleDateString()
            }
        },
        thumbnail: data.url_thumbnail,
        stats: {
            views: data.views_count.toLocaleString(),
            downloads: data.downloads_count.toLocaleString()
        }
    }
}

export async function getUserProfile(username) {
    const supabase = await createClient()
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (error || !profile) {
        console.error(`Error fetching profile ${username}:`, error)
        return null
    }

    // Fetch photos for user
    const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select('*, creator:profiles!photographer_id(full_name, avatar_url)')
        .eq('photographer_id', profile.id)
        .order('created_at', { ascending: false })

    return {
        ...profile,
        name: profile.full_name,
        avatar: profile.avatar_url,
        photos: photos?.map(p => ({
            ...p,
            thumbnail: p.url_thumbnail,
            creator: { name: p.creator.full_name, avatar: p.creator.avatar_url }
        })) || [],
        stats: {
            photos: photos?.length || 0,
            likes: 0, // Placeholder
            collections: 0 // Placeholder
        }
    }
}

export async function searchPhotos(query) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('photos')
        .select(`
        *,
        creator:profiles!photographer_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
        .or(`title.ilike.%${query}%,location.ilike.%${query}%,tags.cs.{"${query}"}`)
        .order('created_at', { ascending: false })

    if (error) return []

    return data.map(photo => ({
        ...photo,
        thumbnail: photo.url_thumbnail,
        creator: {
            name: photo.creator?.full_name,
            avatar: photo.creator?.avatar_url
        }
    }))
}

export async function getUserStats(userId) {
    const supabase = await createClient()

    // Fetch all photos for user to aggregate stats
    const { data: photos, error } = await supabase
        .from('photos')
        .select('views_count, downloads_count, is_premium, likes_count')
        .eq('photographer_id', userId)

    if (error || !photos) return {
        revenue: 0,
        downloads: 0,
        views: 0,
        photosCount: 0,
        sales: []
    }

    const totalViews = photos.reduce((acc, curr) => acc + (curr.views_count || 0), 0)
    const totalDownloads = photos.reduce((acc, curr) => acc + (curr.downloads_count || 0), 0)
    const totalPhotos = photos.length

    // Mock revenue calculation (e.g. 500 FCFA per download if premium?)
    // This logic should be replaced by real transaction table
    const estimatedRevenue = photos.reduce((acc, curr) => {
        return acc + (curr.is_premium ? (curr.downloads_count * 500) : 0)
    }, 0)

    return {
        revenue: estimatedRevenue,
        downloads: totalDownloads,
        views: totalViews,
        photosCount: totalPhotos,
        sales: [] // We don't have a sales table yet
    }
}

export async function getProfileByUserId(userId) {
    const supabase = await createClient()
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error || !profile) {
        console.error(`Error fetching profile by ID ${userId}:`, error)
        return null
    }

    // Fetch photos for user
    const { data: photos, error: photosError } = await supabase
        .from('photos')
        .select(`
            *,
            creator:profiles!photographer_id (
                id,
                username,
                full_name,
                avatar_url,
                available_for_hire
            )
        `)
        .eq('photographer_id', userId)
        .order('created_at', { ascending: false })

    return {
        ...profile,
        name: profile.full_name,
        photos: photos?.map(photo => ({
            ...photo,
            creator: {
                ...photo.creator,
                name: photo.creator?.full_name || 'Unknown',
                avatar: photo.creator?.avatar_url || null
            },
            thumbnail: photo.url_thumbnail
        })) || []
    }
}
// INTERACTIVE ACTIONS

export async function incrementViews(photoId) {
    const supabase = createBrowserClient()
    await supabase.rpc('increment_photo_views', { photo_id: photoId })
}

export async function incrementDownloads(photoId) {
    const supabase = createBrowserClient()
    await supabase.rpc('increment_photo_downloads', { photo_id: photoId })
}

export async function toggleLike(photoId, userId) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase.rpc('toggle_photo_like', {
        p_photo_id: photoId,
        p_user_id: userId
    })
    return data // returns true if liked, false if unliked
}

export async function checkIfLiked(photoId, userId) {
    if (!userId) return false
    const supabase = createBrowserClient()
    const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('photo_id', photoId)
        .eq('user_id', userId)
        .single()
    return !!data
}
