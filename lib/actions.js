import { createClient } from '@/lib/supabase/client'

// INTERACTIVE ACTIONS (Safe for Client Components)

export async function incrementViews(photoId) {
    const supabase = createClient()
    await supabase.rpc('increment_photo_views', { photo_id: photoId })
}

export async function incrementDownloads(photoId) {
    const supabase = createClient()
    await supabase.rpc('increment_photo_downloads', { photo_id: photoId })
}

export async function toggleLike(photoId, userId) {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('toggle_photo_like', {
        p_photo_id: photoId,
        p_user_id: userId
    })
    return data // returns true if liked, false if unliked
}

export async function checkIfLiked(photoId, userId) {
    if (!userId) return false
    const supabase = createClient()
    const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('photo_id', photoId)
        .eq('user_id', userId)
        .single()
    return !!data
}
